import { Text } from "@codemirror/state";
import { TreeCursor } from "@lezer/common";
import type { Token } from "../ast/token/Token.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import { NodeFactory } from "../ast/factory/NodeFactory.ts";
import type { Trivia } from "../ast/token/Trivia.ts";
import { SyntacticParseError } from "../ParseError.ts";
import { getLocationFromTextPosition } from "./locationUtils.ts";
import {
  AlignmentBitCount,
  BinaryLiteral,
  Comment,
  DecimalLiteral,
  FloatingPointLiteral,
  HexadecimalLiteral,
  Identifier,
  IntegerLiteral,
  Whitespace,
} from "../lezer/parser.terms.ts";

const primitiveNodeTypes = new Set([
  AlignmentBitCount,
  BinaryLiteral,
  DecimalLiteral,
  FloatingPointLiteral,
  HexadecimalLiteral,
  Identifier,
  IntegerLiteral,
]);

function getCommentTrivia(cursor: TreeCursor, text: Text): Trivia {
  return {
    text: text.sliceString(cursor.from, cursor.to),
    location: getLocationFromTextPosition(text, cursor.from),
  };
}

export function getToken(
  cursor: TreeCursor,
  text: Text,
): Token {
  return {
    text: text.sliceString(cursor.from, cursor.to),
    location: getLocationFromTextPosition(text, cursor.from),
    leadingTrivia: [],
    trailingTrivia: [],
  };
}

export function getChildNodesAndTokens(
  cursor: TreeCursor,
  text: Text,
): (AbstractNode | Token)[] {
  const childNodesAndTokens = [];
  let childExists = cursor.firstChild();
  let trivia = [];

  while (childExists) {
    if (cursor.type.isError) {
      throw SyntacticParseError.fromTextAndCursor(text, cursor);
    }

    // Skip whitespace
    if (cursor.type.id === Whitespace) {
      childExists = cursor.nextSibling();
      continue;
    }

    // Save comments to set as leading or trailing trivia
    if (cursor.type.id === Comment) {
      trivia.push(getCommentTrivia(cursor, text));
      childExists = cursor.nextSibling();
      continue;
    }

    let childNode: AbstractNode | Token;

    // Check if current sytax node is a terminal token and if so also check it is not a primitive node type
    const isTerminal = !cursor.firstChild();
    let isToken = false;

    if (isTerminal) {
      isToken = !primitiveNodeTypes.has(cursor.type.id);
    } else {
      // return to parent
      cursor.parent();
    }

    // If it is a terminal token, create a Token from the syntax node
    if (isTerminal && isToken) {
      childNode = getToken(cursor, text);

      if (trivia.length > 0) {
        childNode.leadingTrivia = trivia;
        trivia = [];
      }
    } // Otherwise create an AST node from the syntax node
    else {
      childNode = NodeFactory.createNode(cursor, text);

      if (trivia.length > 0) {
        childNode.startToken.leadingTrivia = trivia;
        trivia = [];
      }
    }

    childNodesAndTokens.push(childNode);

    childExists = cursor.nextSibling();
  }

  // return to parent
  cursor.parent();

  // Now look for any trailing comment which might be a sibling to the provided syntaxNode
  // Look for sibling nodes that are comments or whitespace and set them as trailing trivia
  // until a non-comment or non-whitespace node is found and only while any whitespace nodes
  // do not include a newline character.
  let hasSibling = cursor.nextSibling();

  while (hasSibling) {
    if (cursor.type.id === Comment) {
      trivia.push(getCommentTrivia(cursor, text));
    } else if (cursor.type.id === Whitespace) {
      // Only continute while whitespace doesn't contain a newline
      const whitespace = text.sliceString(cursor.from, cursor.to);

      if (whitespace.includes("\n")) {
        // Stop if we encounter a newline in whitespace
        cursor.prevSibling();
        break;
      }
    } else {
      // Stop at the first non-comment, non-whitespace node
      cursor.prevSibling();
      break;
    }

    hasSibling = cursor.nextSibling();
  }

  // If there are remaining trivia, set them as trailing trivia on the last token
  if (trivia.length > 0) {
    const lastChildNodeOrToken =
      childNodesAndTokens[childNodesAndTokens.length - 1];
    if (isAbstractNode(lastChildNodeOrToken)) {
      lastChildNodeOrToken.endToken.trailingTrivia = trivia;
    } else {
      lastChildNodeOrToken.trailingTrivia = trivia;
    }
  }

  return childNodesAndTokens;
}

export function isAbstractNode(
  node: AbstractNode | Token,
): node is AbstractNode {
  return node && typeof node === "object" && "nodeKind" in node;
}
