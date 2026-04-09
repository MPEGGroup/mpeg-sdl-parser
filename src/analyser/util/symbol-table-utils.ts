import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import type { ElementaryType } from "../../ast/node/elementary-type.ts";
import { ElementaryTypeKind } from "../../ast/node/enum/elementary-type-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StringVariableKind } from "../../ast/node/enum/string-variable-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { Token } from "../../ast/node/token.ts";
import {
  isAbstractExpression,
  isElementaryType,
  isIdentifier,
  isNumberLiteral,
  isToken,
  type RequiredNode,
} from "../../ast/util/types.ts";
import { SemanticError } from "../../scanner-error.ts";
import getLogger from "../../util/logger.ts";
import {
  NumericType,
  type Scope,
  ScopeKind,
  StringType,
  type Symbol,
  SymbolKind,
  type SymbolTable,
} from "../symbol-table.ts";

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
  node: RequiredNode<AbstractNode>,
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
  node: RequiredNode<AbstractNode>,
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
  node: RequiredNode<AbstractNode>,
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
          elementaryType.unsignedQualifierKeyword.getLocation(),
        );
      } else {
        logger.debug(
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
          typeToken.getLocation(),
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
          stringVariableKindToken.getLocation(),
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

/**
 * Converts the given node to a required Operand.
 * If the node is undefined or not an AbstractExpression, Identifier or
 * NumberLiteral, it throws a SemanticError in strict mode.
 * In lenient mode, it logs a debug message and returns undefined.
 *
 * @param node the node to convert
 * @param parentNode the parent node for error location context
 * @param strict whether to operate in strict mode
 * @return the node or undefined
 */
export function getRequiredOperand(
  node: RequiredNode<AbstractNode>,
  parentNode: AbstractNode,
  strict: boolean,
): AbstractNode | undefined {
  if (node === undefined) {
    if (strict) {
      throw new SemanticError(
        "Required operand property is missing",
        parentNode.leadingTrivia
          ? parentNode.leadingTrivia[0].location
          : undefined,
      );
    } else {
      logger.debug(
        "Ignoring missing required operand property in lenient mode.",
      );
    }
    return undefined;
  }

  if (
    isAbstractExpression(node) || isIdentifier(node) || isNumberLiteral(node)
  ) {
    return node;
  }

  if (strict) {
    throw new SemanticError(
      "Required operand property is not an AbstractExpression, Identifier or NumberLiteral node: " +
        NodeKind[node.nodeKind],
      node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
    );
  } else {
    logger.debug(
      "Ignoring invalid required operand property in lenient mode.",
    );
    return undefined;
  }
}

function getSymbolString(symbol: Symbol): string {
  const kindName = SymbolKind[symbol.kind];
  let attributesStr = "";

  if (symbol.attributes) {
    const attributes = symbol.attributes;
    const parts: string[] = [];

    if (attributes.stringType !== undefined) {
      parts.push(StringType[attributes.stringType]);
    }

    if (attributes.numericType !== undefined) {
      parts.push(NumericType[attributes.numericType]);
    }

    if (attributes.classType) {
      parts.push("(class: " + attributes.classType + ")");
    }

    if (attributes.mapType) {
      parts.push("(map: " + attributes.mapType + ")");
    }

    if (attributes.isComputed) {
      parts.push("COMPUTED");
    }

    if (attributes.isConst) {
      parts.push("CONST");
    }

    if (attributes.isArray) {
      parts.push("[]");
    }

    attributesStr = parts.length > 0 ? ` ${parts.join(" ")}` : "";
  }
  return `${symbol.name} ${kindName}${attributesStr}`;
}

export function getSymbolTableString(symbolTable: SymbolTable): string {
  const lines: string[] = [];
  const formatScope = (scope: Scope, indent: number): void => {
    const prefix = "  ".repeat(indent);

    lines.push(
      `${prefix}[${ScopeKind[scope.kind]}]${
        scope.kind === ScopeKind.GLOBAL ? "" : " " + scope.name
      }:`,
    );

    if (scope.classMemberSymbols && (scope.classMemberSymbols.size > 0)) {
      lines.push(`${prefix}  members:`);

      for (const memberEntries of scope.classMemberSymbols.values()) {
        for (const entry of memberEntries) {
          const branchStr = entry.branchId
            ? ` (branch: ${entry.branchId})`
            : "";
          lines.push(
            `${prefix}    ${getSymbolString(entry.symbol)}${branchStr}`,
          );
        }
      }
    }

    for (const symbol of scope.symbols.values()) {
      lines.push(`${prefix}  ${getSymbolString(symbol)}`);
    }

    for (const child of scope.children) {
      formatScope(child, indent + 1);
    }
  };

  formatScope(symbolTable.getGlobalScope(), 0);

  return lines.join("\n").trim();
}
