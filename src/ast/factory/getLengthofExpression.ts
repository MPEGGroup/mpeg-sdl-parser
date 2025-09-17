import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { LengthofExpression } from "../node/LengthofExpression.ts";

export function getLengthofExpression(
  cursor: TreeCursor,
  text: Text,
): LengthofExpression {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let operand: AbstractExpression | Identifier | undefined;
  let lengthOfKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closedParenthesisPunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.EXPRESSION:
          operand = childNodeOrToken as AbstractExpression;
          break;
        case NodeKind.IDENTIFIER:
          operand = childNodeOrToken as Identifier;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "lengthof":
          lengthOfKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ")":
          closedParenthesisPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (!operand) {
    throw new InternalParseError("Expected argument operand to be defined");
  }

  if (!lengthOfKeyword) {
    throw new InternalParseError(
      "Expected argument lengthOfKeyword to be defined",
    );
  }

  if (!openParenthesisPunctuator) {
    throw new InternalParseError(
      "Expected argument openParenthesisPunctuator to be defined",
    );
  }

  if (!closedParenthesisPunctuator) {
    throw new InternalParseError(
      "Expected argument closedParenthesisPunctuator to be defined",
    );
  }

  return new LengthofExpression(
    operand,
    lengthOfKeyword,
    openParenthesisPunctuator,
    closedParenthesisPunctuator,
  );
}
