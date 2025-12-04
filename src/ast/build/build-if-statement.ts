import { InternalParseError } from "../../parse-error.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { IfStatement } from "../node/if-statement.ts";
import type { AbstractStatement } from "../node/abstract-statement.ts";
import type { AbstractExpression } from "../node/abstract-expression.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import type { Identifier } from "../node/identifier.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import type { Token } from "../node/token.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildIfStatement(
  buildContext: BuildContext,
): IfStatement {
  const children: Array<AbstractNode> = [];

  const ifKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.IF,
  );
  children.push(ifKeyword);
  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);
  const condition = fetchRequiredNode<
    AbstractExpression | NumberLiteral | Identifier
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(condition);
  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  children.push(closeParenthesisPunctuator);
  const ifStatement = fetchRequiredNode<AbstractStatement>(
    buildContext,
    NodeKind.STATEMENT,
  );
  children.push(ifStatement);
  const elseKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.ELSE,
  );
  let elseStatement: OptionalNode<AbstractStatement> = undefined;
  if (elseKeyword) {
    children.push(elseKeyword);
    elseStatement = fetchOptionalNode<AbstractStatement>(
      buildContext,
      NodeKind.STATEMENT,
    );
    if (elseStatement) {
      children.push(elseStatement);
    } else {
      throw new InternalParseError(
        "Expected else statement after else keyword",
        (elseKeyword as Token).location,
      );
    }
  }

  return new IfStatement(
    ifKeyword,
    openParenthesisPunctuator,
    condition,
    closeParenthesisPunctuator,
    ifStatement,
    elseKeyword,
    elseStatement,
    children,
  );
}
