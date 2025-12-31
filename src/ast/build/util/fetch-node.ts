import getLogger, { debugEnabled } from "../../../util/logger.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import { consumeAbstractNode } from "../consume/consume-abstract-node.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { InternalParseError } from "../../../parse-error.ts";
import type { Token } from "../../node/token.ts";
import {
  isMissingError,
  isToken,
  isUnexpectedError,
  type OneToManyList,
  type OptionalNode,
  type RequiredNode,
  type ZeroToManyList,
} from "../../util/types.ts";
import type { AbstractStatement } from "../../node/abstract-statement.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import { StatementKind } from "../../node/enum/statement-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import type { StringLiteral } from "../../node/string-literal.ts";
import { MissingError } from "../../node/missing-error.ts";
import { getLocationFromTextPosition } from "../../../util/location-utils.ts";
import type { AbstractArrayDimension } from "../../node/abstract-array-dimension.ts";
import type { ClassId } from "../../node/class-id.ts";
import { ArrayDimensionKind } from "../../node/enum/array-dimension-kind.ts";
import { ClassIdKind } from "../../node/enum/class-id-kind.ts";

const logger = getLogger("fetchNode");

function getRequestLogMessage(
  requestedNodeKind?: number[] | number,
  requestedSubKind?: number[] | number,
): string {
  const nodeKindStr = Array.isArray(requestedNodeKind)
    ? requestedNodeKind.map((kind) => NodeKind[kind]).join(", ")
    : requestedNodeKind !== undefined
    ? NodeKind[requestedNodeKind]
    : "any";
  let message = ` for ${nodeKindStr}`;

  if (requestedSubKind !== undefined) {
    switch (requestedNodeKind) {
      case NodeKind.TOKEN:
        if (Array.isArray(requestedSubKind)) {
          message += `, [${
            requestedSubKind
              .map((subKind) => TokenKind[subKind])
              .join(", ")
          }]`;
          break;
        }
        message += `, ${TokenKind[requestedSubKind]}`;
        break;
      case NodeKind.STATEMENT:
        if (Array.isArray(requestedSubKind)) {
          message += `, [${
            requestedSubKind
              .map((subKind) => StatementKind[subKind])
              .join(", ")
          }]`;
          break;
        }
        message += `, ${StatementKind[requestedSubKind]}`;
        break;
      case NodeKind.ARRAY_DIMENSION:
        if (Array.isArray(requestedSubKind)) {
          message += `, [${
            requestedSubKind
              .map((subKind) => ArrayDimensionKind[subKind])
              .join(", ")
          }]`;
          break;
        }
        message += `, ${ArrayDimensionKind[requestedSubKind]}`;
        break;
      case NodeKind.CLASS_ID:
        if (Array.isArray(requestedSubKind)) {
          message += `, [${
            requestedSubKind
              .map((subKind) => ClassIdKind[subKind])
              .join(", ")
          }]`;
          break;
        }
        message += `, ${ClassIdKind[requestedSubKind]}`;
        break;
      default:
        throw new InternalParseError(
          `requestedSubKind matching not implemented for node kind: ${nodeKindStr}`,
        );
    }
  }

  return message;
}

function getNodeDetailsLogMessage(node: AbstractNode): string {
  let message = "";
  if (isToken(node)) {
    message += ` ${node.text.replaceAll("\n", "\\n")}`;
  } else if (node.nodeKind === NodeKind.IDENTIFIER) {
    message += ` ${
      (node as unknown as Identifier).name.replaceAll("\n", "\\n")
    }`;
  } else if (node.nodeKind === NodeKind.NUMBER_LITERAL) {
    message += ` ${(node as unknown as NumberLiteral).value}`;
  } else if (node.nodeKind === NodeKind.STRING_LITERAL) {
    message += ` ${(node as unknown as StringLiteral).value}`;
  }
  return message;
}

function fetchAstNode<T extends AbstractNode>(
  buildContext: BuildContext,
  optional: boolean,
  requestedNodeKind?: number[] | number,
  requestedSubKind?: number[] | number,
): T | undefined {
  if (Array.isArray(requestedNodeKind) && (requestedSubKind !== undefined)) {
    throw new InternalParseError(
      `Cannot specify multiple requestedNodeKind when specifying requestedSubKind.`,
    );
  }

  // use a node if we already have one from a previous call
  // TODO: remove me
  // let node = buildContext.nextNodes.pop() as T | undefined;
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  let node = currentState.nextNode as T | undefined;
  delete currentState.nextNode;

  // consume a node if we don't already have one
  if (node === undefined) {
    node = consumeAbstractNode(buildContext) as T;
  }

  // if we still don't have a node
  if (node === undefined) {
    // if the node was optional, return
    if (optional) {
      return undefined;
    }

    // if the node was required, and we have reached end of siblings, fabricate a MissingError node
    // to satisfy the consumption request for remaining siblings
    // TODO: try without this?
    if (currentState.isEndOfSiblings) {
      logger.debug(
        currentState.indent +
          "fabricating MissingError node at end of siblings" +
          getRequestLogMessage(requestedNodeKind, requestedSubKind),
      );
      const location = getLocationFromTextPosition(
        buildContext.text,
        buildContext.cursor.from,
      );

      return new MissingError(location) as unknown as T;
    }
    // if the node was required, throw an error
    throw new InternalParseError(
      `Required node of kind ${
        Array.isArray(requestedNodeKind)
          ? requestedNodeKind
            .map((kind) => NodeKind[kind])
            .join(", ")
          : requestedNodeKind !== undefined
          ? NodeKind[requestedNodeKind]
          : "any"
      }, but no node was available.`,
    );
  }

  // return unexpected error node even if optional
  if (isUnexpectedError(node)) {
    return node;
  }

  // return missing error node if required
  if (!optional && isMissingError(node)) {
    return node;
  }

  if (
    Array.isArray(requestedNodeKind)
      ? requestedNodeKind.includes(node.nodeKind)
      : requestedNodeKind !== undefined
      ? node.nodeKind === requestedNodeKind
      : true
  ) {
    // return the node if it matches the requested kind and there is no subKind requested
    if (requestedSubKind === undefined) {
      return node;
    }

    // return the node if it matches the requested kind and subKind
    let subKind: number;
    switch (node.nodeKind) {
      case NodeKind.TOKEN:
        subKind = (node as unknown as Token).tokenKind;
        break;
      case NodeKind.STATEMENT:
        subKind = (node as unknown as AbstractStatement).statementKind;
        break;
      case NodeKind.ARRAY_DIMENSION:
        subKind =
          (node as unknown as AbstractArrayDimension).arrayDimensionKind;
        break;
      case NodeKind.CLASS_ID:
        subKind = (node as unknown as ClassId).classIdKind;
        break;
      default:
        throw new InternalParseError(
          `SubKind matching not implemented for node kind: ${
            NodeKind[node.nodeKind]
          }`,
        );
    }
    if (Array.isArray(requestedSubKind)) {
      if (requestedSubKind.includes(subKind)) {
        return node;
      }
    } else {
      if (requestedSubKind === subKind) {
        return node;
      }
    }
  }

  // TODO: remove me
  if (optional) {
    // if it was optional and the node kind did not match
    // store the node for the next call and return undefined
    if (currentState.nextNode) {
      throw new InternalParseError(
        `Logic error: buildContext.nextNode should be undefined before storing a node.`,
      );
    }
    // TODO: remove me
    // buildContext.nextNodes.push(node);
    currentState.nextNode = node;

    return undefined;
  }

  throw new InternalParseError(
    "Logic error: should have returned a node by now.",
  );
}

export function fetchRequiredNode<T extends AbstractNode>(
  buildContext: BuildContext,
  requestedNodeKind?: number[] | number,
  requestedSubKind?: number[] | number,
): RequiredNode<T> {
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "required node request" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) + " ...",
    );
  }
  const node = fetchAstNode<T>(
    buildContext,
    false,
    requestedNodeKind,
    requestedSubKind,
  );

  if (debugEnabled) {
    let message = currentState.indent + "=> required node result" +
      getRequestLogMessage(requestedNodeKind, requestedSubKind) + " => ";
    message += `${NodeKind[node!.nodeKind]}`;
    message += getNodeDetailsLogMessage(node!);
    logger.debug(message);
  }
  return node!;
}

export function fetchOptionalNode<T extends AbstractNode>(
  buildContext: BuildContext,
  requestedNodeKind?: number[] | number,
  requestedSubKind?: number[] | number,
): OptionalNode<T> | undefined {
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "optional node request" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) + "",
    );
  }
  const node = fetchAstNode<T>(
    buildContext,
    true,
    requestedNodeKind,
    requestedSubKind,
  ) as OptionalNode<T>;
  if (debugEnabled) {
    if (node) {
      let message = currentState.indent + "=> optional node result" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) + " => ";
      message += `${NodeKind[node.nodeKind]}`;
      message += getNodeDetailsLogMessage(node);
      logger.debug(message);
    }
  }
  return node;
}

export function fetchZeroToManyList<T extends AbstractNode>(
  buildContext: BuildContext,
  requestedNodeKind: number[] | number,
  requestedSubKind?: number[] | number,
): ZeroToManyList<T> {
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  const nodes: ZeroToManyList<T> = [];
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "zero to many list node request" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) + " ...",
    );
  }
  let node = fetchOptionalNode<T>(
    buildContext,
    requestedNodeKind,
    requestedSubKind,
  );
  while (node !== undefined) {
    nodes.push(node);
    node = fetchOptionalNode<T>(
      buildContext,
      requestedNodeKind,
      requestedSubKind,
    );
  }
  if (debugEnabled) {
    if (nodes.length > 0) {
      logger.debug(
        currentState.indent + "=> zero to many list node result" +
          getRequestLogMessage(requestedNodeKind, requestedSubKind) +
          " => count: " + nodes.length,
      );
    }
  }
  return nodes;
}

export function fetchOneToManyList<T extends AbstractNode>(
  buildContext: BuildContext,
  requestedNodeKind: number[] | number,
  requestedSubKind?: number[] | number,
): OneToManyList<T> {
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  const nodes: OneToManyList<T> = [];
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "one to many list node request" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) + " ...",
    );
  }
  let node = fetchRequiredNode<T>(
    buildContext,
    requestedNodeKind,
    requestedSubKind,
  ) as OptionalNode<T>;
  while (node !== undefined) {
    nodes.push(node);
    node = fetchOptionalNode<T>(
      buildContext,
      requestedNodeKind,
      requestedSubKind,
    );
  }
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "=> one to many list node result" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) +
        " => count: " + nodes.length,
    );
  }
  return nodes;
}

export function fetchOneToManyCommaSeparatedList<T extends AbstractNode>(
  buildContext: BuildContext,
  requestedNodeKind: number[] | number,
  requestedSubKind?: number[] | number,
): { nodes: OneToManyList<T>; commaPunctuators: ZeroToManyList<Token> } {
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  const nodes: OneToManyList<T> = [];
  const commaPunctuators: ZeroToManyList<Token> = [];
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "one to many comma separated list node request" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) + " ...",
    );
  }
  let node = fetchRequiredNode<T>(
    buildContext,
    requestedNodeKind,
    requestedSubKind,
  ) as OptionalNode<T>;
  while (node !== undefined) {
    nodes.push(node);

    // now try to fetch a comma and if not found break
    // otherwise continue to fetch the next node
    const commaPunctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.COMMA,
    );
    if (commaPunctuator === undefined) {
      break;
    }
    commaPunctuators.push(commaPunctuator);
    node = fetchOptionalNode<T>(
      buildContext,
      requestedNodeKind,
      requestedSubKind,
    );
  }
  if (debugEnabled) {
    logger.debug(
      currentState.indent + "=> one to many comma separated list node result" +
        getRequestLogMessage(requestedNodeKind, requestedSubKind) +
        " => count: " + nodes.length,
    );
  }
  return { nodes, commaPunctuators };
}
