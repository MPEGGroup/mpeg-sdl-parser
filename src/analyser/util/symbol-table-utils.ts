import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import type { ElementaryType } from "../../ast/node/elementary-type.ts";
import { ElementaryTypeKind } from "../../ast/node/enum/elementary-type-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StringVariableKind } from "../../ast/node/enum/string-variable-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { Token } from "../../ast/node/token.ts";
import {
  isElementaryType,
  isIdentifier,
  isToken,
} from "../../ast/util/types.ts";
import { SemanticError } from "../../scanner-error.ts";
import getLogger from "../../util/logger.ts";

const logger = getLogger("SymbolTableUtils");

/**
 * Converts the given node to a required Identifier.
 * If the node is undefined or not an Identifier, it throws a SemanticError in strict mode.
 * In lenient mode, it logs a debug message and returns undefined.
 *
 * @param node the node to convert
 * @param parentNode the parent node for error location context
 * @param strict whether to operate in strict mode
 * @return the node as an Identifier or undefined
 */
export function getRequiredIdentifier(
  node: AbstractNode,
  parentNode: AbstractNode,
  strict: boolean,
): Identifier | undefined {
  if (node === undefined) {
    if (strict) {
      throw new SemanticError(
        "Required identifier property is missing",
        parentNode.leadingTrivia
          ? parentNode.leadingTrivia[0].location
          : undefined,
      );
    } else {
      logger.debug(
        "Ignoring missing required identifier property in lenient mode.",
      );
    }
    return undefined;
  }

  if (isIdentifier(node)) {
    return node;
  }

  if (strict) {
    if (isToken(node)) {
      throw new SemanticError(
        `Required identifier property is a Token node: ${
          TokenKind[node.tokenKind]
        }`,
        node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
      );
    }
    throw new SemanticError(
      "Required identifier property is not an Identifier node: " +
        NodeKind[node.nodeKind],
      node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
    );
  } else {
    logger.debug(
      "Ignoring invalid required identifier property in lenient mode.",
    );
    return undefined;
  }
}

/**
 * Converts the given node to a required Token.
 * If the node is undefined or not an Token, it throws a SemanticError in strict mode.
 * In lenient mode, it logs a debug message and returns undefined.
 *
 * @param node the node to convert
 * @param parentNode the parent node for error location context
 * @param strict whether to operate in strict mode
 * @return the node as an Token or undefined
 */
export function getRequiredToken(
  node: AbstractNode,
  parentNode: AbstractNode,
  strict: boolean,
): Token | undefined {
  if (node === undefined) {
    if (strict) {
      throw new SemanticError(
        "Required token property is missing",
        parentNode.leadingTrivia
          ? parentNode.leadingTrivia[0].location
          : undefined,
      );
    } else {
      logger.debug(
        "Ignoring missing required token property in lenient mode.",
      );
    }
    return undefined;
  }

  if (isToken(node)) {
    return node;
  }

  if (strict) {
    throw new SemanticError(
      "Required token property is not a Token node: " + NodeKind[node.nodeKind],
      node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
    );
  } else {
    logger.debug(
      "Ignoring invalid required token property in lenient mode.",
    );
    return undefined;
  }
}

/**
 * Converts the given node to a required ElementaryType.
 * If the node is undefined or not an ElementaryType, it throws a SemanticError in strict mode.
 * In lenient mode, it logs a debug message and returns undefined.
 *
 * @param node the node to convert
 * @param parentNode the parent node for error location context
 * @param strict whether to operate in strict mode
 * @return the node as an ElementaryType or undefined
 */
export function getRequiredElementaryType(
  node: AbstractNode,
  parentNode: AbstractNode,
  strict: boolean,
): ElementaryType | undefined {
  if (node === undefined) {
    if (strict) {
      throw new SemanticError(
        "Required elementary type property is missing",
        parentNode.leadingTrivia
          ? parentNode.leadingTrivia[0].location
          : undefined,
      );
    } else {
      logger.debug(
        "Ignoring missing required elementary type property in lenient mode.",
      );
    }
    return undefined;
  }

  if (isElementaryType(node)) {
    return node;
  }
  if (strict) {
    if (isToken(node)) {
      throw new SemanticError(
        `Required identifier property is a Token node: ${
          TokenKind[node.tokenKind]
        }`,
        node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
      );
    }
    throw new SemanticError(
      "Required elementary type property is not an ElementaryType node: " +
        NodeKind[node.nodeKind],
      node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
    );
  } else {
    logger.debug(
      "Ignoring invalid required elementary type property in lenient mode.",
    );
    return undefined;
  }
}

/**
 * Converts the ElementaryType node to a required ElementaryTypeKind.
 * If the ElementaryType is not populated fully, it throws a SemanticError in strict mode.
 * In lenient mode, it logs a debug message and returns undefined.
 */
export function getElementaryTypeKind(
  elementaryType: ElementaryType,
  strict: boolean,
): ElementaryTypeKind | undefined {
  if (elementaryType.unsignedQualifierKeyword) {
    if (!isToken(elementaryType.unsignedQualifierKeyword)) {
      if (strict) {
        throw new SemanticError(
          "Elementary type unsigned qualifier is not a Token node: " +
            NodeKind[elementaryType.unsignedQualifierKeyword.nodeKind],
          elementaryType.leadingTrivia
            ? elementaryType.leadingTrivia[0].location
            : undefined,
        );
      } else {
        logger.debug(
          "Ignoring invalid elementary type unsigned qualifier in lenient mode.",
        );
        return undefined;
      }
    }

    if (
      elementaryType.unsignedQualifierKeyword.tokenKind !== TokenKind.UNSIGNED
    ) {
      if (strict) {
        throw new SemanticError(
          `Elementary type unsigned qualifier has invalid token kind: ${
            TokenKind[elementaryType.unsignedQualifierKeyword.tokenKind]
          }`,
          elementaryType.unsignedQualifierKeyword.location,
        );
      } else {
        logger.error(
          `Ignoring invalid elementary type unsigned qualifier token kind: ${
            TokenKind[elementaryType.unsignedQualifierKeyword.tokenKind]
          } in lenient mode.`,
        );
        return undefined;
      }
    }
  }

  if (!isToken(elementaryType.typeKeyword)) {
    if (strict) {
      throw new SemanticError(
        "Elementary type type keyword is not a Token node: " +
          NodeKind[elementaryType.typeKeyword.nodeKind],
        elementaryType.leadingTrivia
          ? elementaryType.leadingTrivia[0].location
          : undefined,
      );
    } else {
      logger.debug(
        "Ignoring invalid elementary type type keyword in lenient mode.",
      );
      return undefined;
    }
  }

  const isUnsigned = elementaryType.unsignedQualifierKeyword !== undefined;
  const typeToken = elementaryType.typeKeyword as Token;

  switch (typeToken.tokenKind) {
    case TokenKind.INT:
      return isUnsigned
        ? ElementaryTypeKind.UNSIGNED_INTEGER
        : ElementaryTypeKind.INTEGER;
    case TokenKind.FLOAT:
      return ElementaryTypeKind.FLOATING_POINT;
    case TokenKind.BIT:
      return ElementaryTypeKind.BIT;
    default:
      if (strict) {
        throw new SemanticError(
          `Unsupported elementary type token kind: ${
            TokenKind[typeToken.tokenKind]
          }`,
          typeToken.location,
        );
      } else {
        logger.debug(
          `Ignoring unsupported elementary type token kind: ${
            TokenKind[typeToken.tokenKind]
          } in lenient mode.`,
        );
        return undefined;
      }
  }
}

/**
 * Converts the given string variable kind Token to a required StringVariableKind.
 * If the Token is not populated fully, it throws a SemanticError in strict mode.
 * In lenient mode, it logs a debug message and returns undefined.
 */
export function getStringVariableKind(
  stringVariableKindToken: Token,
  strict: boolean,
): StringVariableKind | undefined {
  switch (stringVariableKindToken.tokenKind) {
    case TokenKind.BASE64_STRING:
      return StringVariableKind.BASE64;
    case TokenKind.UTF8_STRING:
      return StringVariableKind.UTF8;
    case TokenKind.UTF16_STRING:
      return StringVariableKind.UTF16;
    case TokenKind.UTF_STRING:
      return StringVariableKind.UTF;
    case TokenKind.UTF8_LIST:
      return StringVariableKind.UTF8_LIST;
    default:
      if (strict) {
        throw new SemanticError(
          `Unsupported string variable kind token: ${
            TokenKind[stringVariableKindToken.tokenKind]
          }`,
          stringVariableKindToken.location,
        );
      } else {
        logger.debug(
          `Ignoring unsupported string variable kind token: ${
            TokenKind[stringVariableKindToken.tokenKind]
          } in lenient mode.`,
        );
        return undefined;
      }
  }
}
