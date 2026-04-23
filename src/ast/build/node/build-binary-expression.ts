import { NodeKind } from "../../node/enum/node-kind.ts";
import { BinaryExpression } from "../../node/binary-expression.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import { isToken } from "../../util/types.ts";
import { BinaryOperatorKind } from "../../node/enum/binary-operator-kind.ts";

function getBinaryOperatorKind(
  token: Token,
): BinaryOperatorKind | undefined {
  const tokenKind = token.tokenKind;

  switch (tokenKind) {
    case TokenKind.ASSIGNMENT:
      return BinaryOperatorKind.ASSIGNMENT;
    case TokenKind.MULTIPLICATION:
      return BinaryOperatorKind.MULTIPLY;
    case TokenKind.DIVISION:
      return BinaryOperatorKind.DIVIDE;
    case TokenKind.MODULUS:
      return BinaryOperatorKind.MODULUS;
    case TokenKind.ADDITION:
      return BinaryOperatorKind.ADD;
    case TokenKind.SUBTRACTION:
      return BinaryOperatorKind.SUBTRACT;
    case TokenKind.BITWISE_SHIFT_LEFT:
      return BinaryOperatorKind.SHIFT_LEFT;
    case TokenKind.BITWISE_SHIFT_RIGHT:
      return BinaryOperatorKind.SHIFT_RIGHT;
    case TokenKind.RELATIONAL_LESS_THAN:
      return BinaryOperatorKind.LESS_THAN;
    case TokenKind.RELATIONAL_LESS_THAN_OR_EQUAL:
      return BinaryOperatorKind.LESS_THAN_OR_EQUAL;
    case TokenKind.RELATIONAL_GREATER_THAN:
      return BinaryOperatorKind.GREATER_THAN;
    case TokenKind.RELATIONAL_GREATER_THAN_OR_EQUAL:
      return BinaryOperatorKind.GREATER_THAN_OR_EQUAL;
    case TokenKind.RELATIONAL_EQUAL:
      return BinaryOperatorKind.EQUAL;
    case TokenKind.RELATIONAL_NOT_EQUAL:
      return BinaryOperatorKind.NOT_EQUAL;
    case TokenKind.BITWISE_AND:
      return BinaryOperatorKind.BITWISE_AND;
    case TokenKind.BITWISE_OR:
      return BinaryOperatorKind.BITWISE_OR;
    case TokenKind.LOGICAL_AND:
      return BinaryOperatorKind.LOGICAL_AND;
    case TokenKind.LOGICAL_OR:
      return BinaryOperatorKind.LOGICAL_OR;
    default:
      return undefined;
  }
}

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
      TokenKind.ASSIGNMENT,
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

  let binaryOperatorKind: BinaryOperatorKind | undefined;
  if (isToken(binaryOperator)) {
    binaryOperatorKind = getBinaryOperatorKind(binaryOperator);
  }

  const rightOperand = fetchRequiredNode<Token>(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(rightOperand);

  return new BinaryExpression(
    leftOperand,
    binaryOperator,
    rightOperand,
    binaryOperatorKind,
    children,
  );
}
