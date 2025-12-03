import { NodeKind } from "../node/enum/node_kind.ts";
import { BinaryExpression } from "../node/BinaryExpression.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildBinaryExpression(
  buildContext: BuildContext,
): BinaryExpression {
  const children: Array<AbstractNode> = [];

  const leftOperand = fetchRequiredNode<Token>(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(leftOperand);

  const binaryOperator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    [
      TokenKind.ADDITION,
      TokenKind.SUBTRACTION,
      TokenKind.MULTIPLICATION,
      TokenKind.DIVISION,
      TokenKind.MODULUS,
      TokenKind.BITWISE_SHIFT_LEFT,
      TokenKind.BITWISE_SHIFT_RIGHT,
      TokenKind.RELATIONAL_LESS_THAN,
      TokenKind.RELATIONAL_LESS_THAN_OR_EQUAL,
      TokenKind.RELATIONAL_GREATER_THAN,
      TokenKind.RELATIONAL_GREATER_THAN_OR_EQUAL,
      TokenKind.RELATIONAL_EQUAL,
      TokenKind.RELATIONAL_NOT_EQUAL,
      TokenKind.BITWISE_AND,
      TokenKind.BITWISE_OR,
      TokenKind.LOGICAL_AND,
      TokenKind.LOGICAL_OR,
    ],
  );
  children.push(binaryOperator);

  const rightOperand = fetchRequiredNode<Token>(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(rightOperand);

  return new BinaryExpression(
    leftOperand,
    binaryOperator,
    rightOperand,
    children,
  );
}
