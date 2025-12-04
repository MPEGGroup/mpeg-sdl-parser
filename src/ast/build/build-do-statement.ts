import { NodeKind } from "../node/enum/node-kind.ts";
import type { AbstractExpression } from "../node/abstract-expression.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import type { Identifier } from "../node/identifier.ts";
import { DoStatement } from "../node/do-statement.ts";
import { CompoundStatement } from "../node/compound-statement.ts";
import type { BuildContext } from "./build-context.ts";
import type { Token } from "../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import { StatementKind } from "../node/enum/statement-kind.ts";

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
