import { NodeKind } from "../node/enum/node-kind.ts";
import type { AbstractExpression } from "../node/abstract-expression.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import type { Identifier } from "../node/identifier.ts";
import { WhileStatement } from "../node/while-statement.ts";
import { CompoundStatement } from "../node/compound-statement.ts";
import { StatementKind } from "../node/enum/statement-kind.ts";
import type { BuildContext } from "./build-context.ts";
import type { Token } from "../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildWhileStatement(
  buildContext: BuildContext,
): WhileStatement {
  const whileKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.WHILE,
  );
  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  const condition = fetchRequiredNode<
    AbstractExpression | Identifier | NumberLiteral
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  const compoundStatement = fetchRequiredNode<CompoundStatement>(
    buildContext,
    NodeKind.STATEMENT,
    StatementKind.COMPOUND,
  );
  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );

  return new WhileStatement(
    whileKeyword,
    openParenthesisPunctuator,
    condition,
    closeParenthesisPunctuator,
    compoundStatement,
    [
      whileKeyword,
      openParenthesisPunctuator,
      condition,
      closeParenthesisPunctuator,
      compoundStatement,
    ],
  );
}
