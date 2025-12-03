import { NodeKind } from "../node/enum/node_kind.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import { SwitchStatement } from "../node/SwitchStatement.ts";
import { CaseClause } from "../node/CaseClause.ts";
import { DefaultClause } from "../node/DefaultClause.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";

export function buildSwitchStatement(
  buildContext: BuildContext,
): SwitchStatement {
  const children: Array<AbstractNode> = [];

  const switchKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  children.push(switchKeyword);
  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);
  const expression = fetchRequiredNode<
    AbstractExpression | NumberLiteral | Identifier
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(expression);
  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  children.push(closeParenthesisPunctuator);
  const openBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  children.push(openBracePunctuator);
  const caseClauses = fetchZeroToManyList<CaseClause>(
    buildContext,
    NodeKind.CASE_CLAUSE,
  );
  const defaultClause = fetchOptionalNode<DefaultClause>(
    buildContext,
    NodeKind.DEFAULT_CLAUSE,
  );
  if (defaultClause) {
    children.push(defaultClause);
  }
  const closeBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACE,
  );
  children.push(closeBracePunctuator);

  return new SwitchStatement(
    switchKeyword,
    openParenthesisPunctuator,
    expression,
    closeParenthesisPunctuator,
    openBracePunctuator,
    caseClauses,
    defaultClause,
    closeBracePunctuator,
    children,
  );
}
