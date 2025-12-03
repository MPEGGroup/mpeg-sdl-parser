import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { LengthofExpression } from "../node/length-of-expression.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildLengthofExpression(
  buildContext: BuildContext,
): LengthofExpression {
  const lengthOfKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.LENGTHOF,
  );
  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  const operand = fetchRequiredNode<AbstractExpression | Identifier>(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER],
  );
  const closedParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );

  return new LengthofExpression(
    lengthOfKeyword,
    openParenthesisPunctuator,
    operand,
    closedParenthesisPunctuator,
    [
      lengthOfKeyword,
      openParenthesisPunctuator,
      operand,
      closedParenthesisPunctuator,
    ],
  );
}
