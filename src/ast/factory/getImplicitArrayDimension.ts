import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { ImplicitArrayDimension } from "../node/ImplicitArrayDimension.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getImplicitArrayDimension(
  cursor: TreeCursor,
  text: Text,
): ImplicitArrayDimension {
  let rangeStart: AbstractExpression | Identifier | NumberLiteral | undefined;
  let rangeEnd: AbstractExpression | Identifier | NumberLiteral | undefined;
  let openBracketPunctuator: Token | undefined;
  let rangeOperator: Token | undefined;
  let closeBracketPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          if (rangeStart === undefined) {
            rangeStart = childNodeOrToken as Identifier;
          } else {
            rangeEnd = childNodeOrToken as Identifier;
          }
          break;
        case NodeKind.NUMBER_LITERAL:
          if (rangeStart === undefined) {
            rangeStart = childNodeOrToken as NumberLiteral;
          } else {
            rangeEnd = childNodeOrToken as NumberLiteral;
          }
          break;
        case NodeKind.EXPRESSION:
          if (rangeStart === undefined) {
            rangeStart = childNodeOrToken as AbstractExpression;
          } else {
            rangeEnd = childNodeOrToken as AbstractExpression;
          }
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "[":
          openBracketPunctuator = childNodeOrToken;
          break;
        case "..":
          rangeOperator = childNodeOrToken;
          break;
        case "]":
          closeBracketPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
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
  return new ImplicitArrayDimension(
    rangeStart,
    rangeEnd,
    openBracketPunctuator,
    rangeOperator,
    closeBracketPunctuator,
  );
}
