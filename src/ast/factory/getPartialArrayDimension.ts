import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { PartialArrayDimension } from "../node/PartialArrayDimension.ts";

export function getPartialArrayDimension(
  cursor: TreeCursor,
  text: Text,
): PartialArrayDimension {
  let index: AbstractExpression | Identifier | NumberLiteral | undefined;
  let openBracketPunctuator: Token | undefined;
  let innerOpenBracketPunctuator: Token | undefined;
  let innerCloseBracketPunctuator: Token | undefined;
  let closeBracketPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          index = childNodeOrToken as Identifier;
          break;
        case NodeKind.NUMBER_LITERAL:
          index = childNodeOrToken as NumberLiteral;
          break;
        case NodeKind.EXPRESSION:
          index = childNodeOrToken as AbstractExpression;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "[":
          if (openBracketPunctuator === undefined) {
            openBracketPunctuator = childNodeOrToken;
          } else {
            innerOpenBracketPunctuator = childNodeOrToken;
          }
          break;
        case "]":
          if (closeBracketPunctuator === undefined) {
            closeBracketPunctuator = childNodeOrToken;
          } else {
            innerCloseBracketPunctuator = childNodeOrToken;
          }
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (index === undefined) {
    throw new InternalParseError("Expected argument index to be defined");
  }
  if (openBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument openBracketPunctuator to be defined",
    );
  }
  if (closeBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument closeBracketPunctuator to be defined",
    );
  }
  if (innerOpenBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument innerOpenBracketPunctuator to be defined",
    );
  }
  if (innerCloseBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument innerCloseBracketPunctuator to be defined",
    );
  }
  return new PartialArrayDimension(
    index,
    openBracketPunctuator,
    innerOpenBracketPunctuator,
    innerCloseBracketPunctuator,
    closeBracketPunctuator,
  );
}
