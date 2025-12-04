import { InternalParseError } from "../../parse-error.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import type { AbstractStatement } from "../node/abstract-statement.ts";
import type { AbstractExpression } from "../node/abstract-expression.ts";
import { ForStatement } from "../node/for-statement.ts";
import { ComputedElementaryTypeDefinition } from "../node/computed-elementary-type-definition.ts";
import { StatementKind } from "../node/enum/statement-kind.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildForStatement(
  buildContext: BuildContext,
): ForStatement {
  const children: Array<AbstractNode> = [];

  const forKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.FOR,
  );
  children.push(forKeyword);
  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);
  const expression1 = fetchOptionalNode<AbstractExpression>(
    buildContext,
    NodeKind.EXPRESSION,
  );
  let semicolon1Punctuator: OptionalNode<Token> = undefined;
  let computedElementaryTypeDefinition: OptionalNode<
    ComputedElementaryTypeDefinition
  > = undefined;
  if (expression1) {
    children.push(expression1);
    semicolon1Punctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.SEMICOLON,
    );
    if (semicolon1Punctuator) {
      children.push(semicolon1Punctuator);
    } else {
      throw new InternalParseError(
        "Expected semicolon after first expression in for statement",
      );
    }
  } else {
    computedElementaryTypeDefinition = fetchOptionalNode<
      ComputedElementaryTypeDefinition
    >(
      buildContext,
      NodeKind.STATEMENT,
      StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION,
    );
    if (computedElementaryTypeDefinition) {
      children.push(computedElementaryTypeDefinition);
    } else {
      throw new InternalParseError(
        "Expected either an expression or a computed elementary type definition in for statement",
      );
    }
  }

  const expression2 = fetchOptionalNode<AbstractExpression>(
    buildContext,
    NodeKind.EXPRESSION,
  );
  if (expression2) {
    children.push(expression2);
  }
  const semicolon2Punctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );
  children.push(semicolon2Punctuator);
  const expression3 = fetchOptionalNode<AbstractExpression>(
    buildContext,
    NodeKind.EXPRESSION,
  );
  if (expression3) {
    children.push(expression3);
  }
  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  children.push(closeParenthesisPunctuator);
  const statement = fetchRequiredNode<AbstractStatement>(
    buildContext,
    NodeKind.STATEMENT,
  );
  children.push(statement);

  return new ForStatement(
    forKeyword,
    openParenthesisPunctuator,
    expression1,
    computedElementaryTypeDefinition,
    semicolon1Punctuator,
    expression2,
    semicolon2Punctuator,
    expression3,
    closeParenthesisPunctuator,
    statement,
    children,
  );
}
