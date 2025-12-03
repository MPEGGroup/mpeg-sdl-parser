import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { IfStatement } from "../node/IfStatement.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import type { OptionalNode } from "../util/types.ts";
import type { Token } from "../node/Token.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
