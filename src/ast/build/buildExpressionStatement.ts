import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { ExpressionStatement } from "../node/ExpressionStatement.ts";
import type { BuildContext } from "./BuildContext.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { Token } from "../node/Token.ts";

export function buildExpressionStatement(
  buildContext: BuildContext,
): ExpressionStatement {
  const expression = fetchRequiredNode<
    AbstractExpression | Identifier | NumberLiteral
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );

  return new ExpressionStatement(
    expression,
    semicolonPunctuator,
    [expression, semicolonPunctuator],
  );
}
