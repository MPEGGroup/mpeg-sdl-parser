import type { AbstractExpression } from "../../node/abstract-expression.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import { ExpressionStatement } from "../../node/expression-statement.ts";
import type { BuildContext } from "../util/build-context.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import type { Token } from "../../node/token.ts";

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
