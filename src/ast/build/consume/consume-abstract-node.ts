import type { AbstractNode } from "../../node/abstract-node.ts";
import type { BuildContext } from "../util/build-context.ts";
import { createParseErrorFromTextAndCursor } from "../../../lezer/create-parse-error-from-text-and-cursor.ts";
import { primitiveNodeProp } from "../../../lezer/props/primitive-node-prop-source.ts";
import { buildToken } from "../node/build-token.ts";
import { consumeTrivia } from "./consume-trivia.ts";
import { InternalParseError } from "../../../parse-error.ts";
import getLogger from "../../../util/logger.ts";
import { buildMissingError } from "../node/build-missing-error.ts";
import { consumePrimitive } from "./consume-primitive.ts";
import { consumeAstNode } from "./consume-ast-node.ts";
import { Specification } from "../../node/specification.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { tokenKindByTokenTypeId } from "../util/token-kind-by-token-type-id-map.ts";
import { nodeKindByTokenTypeId } from "../util/node-kind-by-token-type-id-map.ts";
import { UnexpectedError } from "../../node/unexpected-error.ts";

const logger = getLogger("consumeAbstractNode");

export enum NodeScenario {
  /** Missing Error Node */
  MISSING_NODE,
  /** Unexpected Error Node containing a child which is the unexpected token */
  UNEXPECTED_NODE,
  /** Unknown Error Node which has text of an unknown token */
  UNKNOWN_TOKEN,
  /** Primitive Node e.g. Identifier, IntegerLiteral... */
  PRIMITIVE,
  /** Terminal Token Node e.g. class, int... */
  TOKEN,
  /** Non-Terminal AST Node e.g. ClassDeclaration, ExpressionStatement... */
  AST_NODE,
  /** Terminal AST Node with missing children e.g. ClassDeclaration, ExpressionStatement... */
  EMPTY_AST_NODE,
}

function determineNodeScenario(
  buildContext: BuildContext,
): NodeScenario {
  const { cursor, text, lenient } = buildContext;
  const isError = cursor.type.isError;

  if (isError && !lenient) {
    throw createParseErrorFromTextAndCursor(text, cursor);
  }

  // Check if current sytax node is a terminal token by attempting to move to first child
  const childExists = cursor.firstChild();

  if (isError) {
    // If the cursor was an error and it has a child, it is an unexpected token error
    // In this case the child is the unexpected token, we can treat it like an AST node
    // so move back to parent
    if (childExists) {
      cursor.parent();
      return NodeScenario.UNEXPECTED_NODE;
    }

    // If it is an error and no child exists, check if there is text, if so treat this as an
    // unknown token error.
    if (cursor.to > cursor.from) {
      return NodeScenario.UNKNOWN_TOKEN;
    }

    // Otherwise it is a missing node error.
    return NodeScenario.MISSING_NODE;
  }

  // If we have a child, we should not use it yet, so move back to parent
  if (childExists) {
    cursor.parent();
  }

  // Primitive is a terminal custom text rather than a syntax token, this will be treated slightly differently
  if (cursor.type.prop(primitiveNodeProp)) {
    return NodeScenario.PRIMITIVE;
  }

  // Check if it is a token type
  if (tokenKindByTokenTypeId.get(cursor.type.id) !== undefined) {
    return NodeScenario.TOKEN;
  }

  // If it has no children, it is an empty AST node
  if (!childExists) {
    return NodeScenario.EMPTY_AST_NODE;
  }

  // Otherwise it is a non-terminal AST node
  return NodeScenario.AST_NODE;
}

/*
 * Iterate through the syntax tree and consume parse tree tokens to create an AST node.
 */
export function consumeAbstractNode(
  buildContext: BuildContext,
): AbstractNode | undefined {
  const { cursor } = buildContext;
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];

  // Get any leading trivia for the node
  const leadingTrivia = consumeTrivia(buildContext, false);

  // If no siblings remain to be consumed, return undefined
  if (currentState.isEndOfSiblings) {
    if (leadingTrivia.length > 0) {
      if (buildContext.unconsumedTrivia) {
        throw new InternalParseError(
          `Expected no unconsumed trivia, but found some.`,
        );
      }
      buildContext.unconsumedTrivia = leadingTrivia;
    }
    return undefined;
  }

  // Determine what kind of node we are about to consume
  const nodeScenario = determineNodeScenario(buildContext);

  logger.debug(
    currentState.indent + "consuming node: " + cursor.name +
      ` (scenario: ${NodeScenario[nodeScenario]})`,
  );

  let node;

  switch (nodeScenario) {
    case NodeScenario.MISSING_NODE:
      node = buildMissingError(buildContext);
      break;
    case NodeScenario.PRIMITIVE:
      node = consumePrimitive(buildContext);
      break;
    case NodeScenario.UNKNOWN_TOKEN: {
      const unknownToken = buildToken(buildContext);
      // wrap unknown token in unexpected node
      node = new UnexpectedError(unknownToken);
      break;
    }
    case NodeScenario.TOKEN:
      node = buildToken(buildContext);
      break;
    case NodeScenario.UNEXPECTED_NODE:
    case NodeScenario.AST_NODE:
      node = consumeAstNode(buildContext);
      break;
    case NodeScenario.EMPTY_AST_NODE: {
      const nodeKind = nodeKindByTokenTypeId.get(cursor.type.id);

      if (nodeKind === undefined) {
        throw new InternalParseError(
          `No nodeKind mapping found for token type id: ${cursor.type.id} (${cursor.type.name})`,
        );
      }

      // Allow specification to have no children
      if (nodeKind == NodeKind.SPECIFICATION) {
        return new Specification([]);
      } else {
        throw new InternalParseError(
          `Expected node to have at least one child: ${NodeKind[nodeKind]}`,
        );
      }
    }
    default: {
      const exhaustiveCheck: never = nodeScenario;
      throw new InternalParseError(
        "Unreachable code reached, nodeScenario == " + exhaustiveCheck,
      );
    }
  }

  // Set any leading trivia now we have the node
  if (leadingTrivia.length > 0) {
    node.leadingTrivia = leadingTrivia;
  }

  // Now that we have consumed a node, move to next sibling
  if (cursor.nextSibling()) {
    currentState.isEndOfSiblings = false;
  } else {
    currentState.isEndOfSiblings = true;
  }

  // Get any trailing trivia for the node
  const trailingTrivia = consumeTrivia(buildContext, true);
  if (trailingTrivia.length > 0) {
    node.trailingTrivia = trailingTrivia;
  }

  logger.debug(
    currentState.indent + "current node: " + cursor.name +
      (currentState.isEndOfSiblings ? ": end of siblings" : ""),
  );

  return node;
}
