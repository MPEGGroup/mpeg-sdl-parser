import { NodeKind } from "../node/enum/node_kind.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import { DoStatement } from "../node/DoStatement.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";

export function buildDoStatement(
  buildContext: BuildContext,
): DoStatement {
  const doKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.DO,
  );
  const compoundStatement = fetchRequiredNode<CompoundStatement>(
    buildContext,
    NodeKind.STATEMENT,
    StatementKind.COMPOUND,
  );
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
    AbstractExpression | NumberLiteral | Identifier
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );

  return new DoStatement(
    doKeyword,
    compoundStatement,
    whileKeyword,
    openParenthesisPunctuator,
    condition,
    closeParenthesisPunctuator,
    semicolonPunctuator,
    [
      doKeyword,
      compoundStatement,
      whileKeyword,
      openParenthesisPunctuator,
      condition,
      closeParenthesisPunctuator,
      semicolonPunctuator,
    ],
  );
}
