import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { BinaryOperatorKind } from "../node/enum/binary_operator_kind.ts";
import { BinaryExpression } from "../node/BinaryExpression.ts";

export function getBinaryExpression(
  cursor: TreeCursor,
  text: Text,
): BinaryExpression {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let leftOperand: AbstractExpression | Identifier | NumberLiteral | undefined;
  let binaryOperatorKind: BinaryOperatorKind | undefined;
  let rightOperand: AbstractExpression | Identifier | NumberLiteral | undefined;
  let binaryOperator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.NUMBER_LITERAL:
          if (leftOperand) {
            rightOperand = childNodeOrToken as NumberLiteral;
          } else {
            leftOperand = childNodeOrToken as NumberLiteral;
          }
          break;
        case NodeKind.EXPRESSION:
          if (leftOperand) {
            rightOperand = childNodeOrToken as AbstractExpression;
          } else {
            leftOperand = childNodeOrToken as AbstractExpression;
          }
          break;
        case NodeKind.IDENTIFIER:
          if (leftOperand) {
            rightOperand = childNodeOrToken as Identifier;
          } else {
            leftOperand = childNodeOrToken as Identifier;
          }
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "+":
          binaryOperatorKind = BinaryOperatorKind.ADD;
          break;
        case "-":
          binaryOperatorKind = BinaryOperatorKind.SUBTRACT;
          break;
        case "*":
          binaryOperatorKind = BinaryOperatorKind.MULTIPLY;
          break;
        case "/":
          binaryOperatorKind = BinaryOperatorKind.DIVIDE;
          break;
        case "%":
          binaryOperatorKind = BinaryOperatorKind.MODULUS;
          break;
        case "<<":
          binaryOperatorKind = BinaryOperatorKind.SHIFT_LEFT;
          break;
        case ">>":
          binaryOperatorKind = BinaryOperatorKind.SHIFT_RIGHT;
          break;
        case "<":
          binaryOperatorKind = BinaryOperatorKind.LESS_THAN;
          break;
        case "<=":
          binaryOperatorKind = BinaryOperatorKind.LESS_THAN_OR_EQUAL;
          break;
        case ">":
          binaryOperatorKind = BinaryOperatorKind.GREATER_THAN;
          break;
        case ">=":
          binaryOperatorKind = BinaryOperatorKind.GREATER_THAN_OR_EQUAL;
          break;
        case "==":
          binaryOperatorKind = BinaryOperatorKind.EQUAL;
          break;
        case "!=":
          binaryOperatorKind = BinaryOperatorKind.NOT_EQUAL;
          break;
        case "&":
          binaryOperatorKind = BinaryOperatorKind.BITWISE_AND;
          break;
        case "|":
          binaryOperatorKind = BinaryOperatorKind.BITWISE_OR;
          break;
        case "&&":
          binaryOperatorKind = BinaryOperatorKind.LOGICAL_AND;
          break;
        case "||":
          binaryOperatorKind = BinaryOperatorKind.LOGICAL_OR;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
      binaryOperator = childNodeOrToken as Token;
    }
  }

  if (leftOperand === undefined) {
    throw new InternalParseError("Expected argument leftOperand to be defined");
  }

  if (binaryOperatorKind === undefined) {
    throw new InternalParseError(
      "Expected argument binaryOperatorKind to be defined",
    );
  }

  if (rightOperand === undefined) {
    throw new InternalParseError(
      "Expected argument rightOperand to be defined",
    );
  }

  if (binaryOperator === undefined) {
    throw new InternalParseError(
      "Expected argument binaryOperator to be defined",
    );
  }

  return new BinaryExpression(
    leftOperand,
    binaryOperatorKind,
    rightOperand,
    binaryOperator,
  );
}
