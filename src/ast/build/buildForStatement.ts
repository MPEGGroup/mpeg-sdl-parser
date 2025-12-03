import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { ForStatement } from "../node/ForStatement.ts";
import { ComputedElementaryTypeDefinition } from "../node/ComputedElementaryTypeDefinition.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
