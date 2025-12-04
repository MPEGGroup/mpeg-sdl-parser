import type { AbstractExpression } from "../node/abstract-expression.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import type { Identifier } from "../node/identifier.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import { UnaryExpression } from "../node/unary-expression.ts";
import { ArrayElementAccess } from "../node/array-element-access.ts";
import type { ClassMemberAccess } from "../node/class-member-access.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import { Token } from "../node/token.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import { InternalParseError } from "../../parse-error.ts";
import type { OptionalNode } from "../util/types.ts";

export function buildUnaryExpression(
  buildContext: BuildContext,
): AbstractExpression | Identifier | NumberLiteral {
  const children: Array<AbstractNode> = [];

  const unaryOperator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    [
      TokenKind.UNARY_PLUS,
      TokenKind.UNARY_NEGATION,
    ],
  );

  if (unaryOperator) {
    children.push(unaryOperator);
  }

  const openParenthesisPunctuator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );

  if (openParenthesisPunctuator) {
    children.push(openParenthesisPunctuator);
  }

  const operand = fetchRequiredNode<
    AbstractExpression | Identifier | NumberLiteral
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );

  children.push(operand);

  let closeParenthesisPunctuator: OptionalNode<Token> = undefined;
  if (openParenthesisPunctuator) {
    closeParenthesisPunctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.CLOSE_PARENTHESIS,
    );

    if (closeParenthesisPunctuator) {
      children.push(closeParenthesisPunctuator);
    } else {
      throw new InternalParseError(
        "Expected closing parenthesis for unary expression which includes open parenthesis",
        (openParenthesisPunctuator as Token).location,
      );
    }
  }

  const arrayElementAccess = fetchOptionalNode<ArrayElementAccess>(
    buildContext,
    NodeKind.ARRAY_ELEMENT_ACCESS,
  );

  if (arrayElementAccess) {
    children.push(arrayElementAccess);
  }

  const classMemberAccess = fetchOptionalNode<ClassMemberAccess>(
    buildContext,
    NodeKind.CLASS_MEMBER_ACCESS,
  );

  if (classMemberAccess) {
    children.push(classMemberAccess);
  }

  const postfixOperator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    [TokenKind.POSTFIX_INCREMENT, TokenKind.POSTFIX_DECREMENT],
  );

  if (postfixOperator) {
    children.push(postfixOperator);
  }

  return new UnaryExpression(
    unaryOperator,
    openParenthesisPunctuator,
    operand,
    closeParenthesisPunctuator,
    arrayElementAccess,
    classMemberAccess,
    postfixOperator,
    children,
  );
}
