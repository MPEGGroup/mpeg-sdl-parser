import { NodeKind } from "../../node/enum/node-kind.ts";
import type { AbstractExpression } from "../../node/abstract-expression.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import type { Identifier } from "../../node/identifier.ts";
import { SwitchStatement } from "../../node/switch-statement.ts";
import { CaseClause } from "../../node/case-clause.ts";
import { DefaultClause } from "../../node/default-clause.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";

export function buildSwitchStatement(
  buildContext: BuildContext,
): SwitchStatement {
  const children: Array<AbstractNode> = [];

  const switchKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SWITCH,
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
  children.push(...caseClauses);
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
