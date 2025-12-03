import { NodeKind } from "../node/enum/node_kind.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import { WhileStatement } from "../node/WhileStatement.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
