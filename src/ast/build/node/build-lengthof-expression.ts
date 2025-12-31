import type { AbstractExpression } from "../../node/abstract-expression.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { LengthofExpression } from "../../node/length-of-expression.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

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
