import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import { BinaryOperatorKind } from "../../ast/node/enum/binary-operator-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { NumberLiteral } from "../../ast/node/number-literal.ts";
import { isIdentifier, isNumberLiteral } from "../../ast/util/types.ts";
import { resolveNumericType } from "../util/type-utils.ts";
import { NumericType } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";
import type { SymbolTable } from "../symbol-table.ts";

function checkConstMutationViaAssignment(
  node: BinaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.ASSIGNMENT) {
    return [];
  }

  if (!isIdentifier(node.leftOperand)) {
    return [];
  }

  const identifier = node.leftOperand as Identifier;
  const symbol = symbolTable.lookupVariable(identifier.name);

  if (symbol && symbol.attributes.isConst && symbol.attributes.isComputed) {
    return [{
      message: "a const computed variable cannot be mutated.",
      location: node.startToken!.location,
    }];
  }

  return [];
}

function checkModulusWithNegativeRhs(
  node: BinaryExpression,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.MODULUS) {
    return [];
  }

  if (!isNumberLiteral(node.rightOperand)) {
    return [];
  }

  const rightLiteral = node.rightOperand as NumberLiteral;
  if (rightLiteral.value < 0) {
    return [{
      message:
        "Using the modulus operator with a negative right-hand operand will lead to undefined behavior.",
      location: node.startToken!.location,
      isWarning: true,
    }];
  }

  return [];
}

function checkModulusWithFloatOperands(
  node: BinaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.MODULUS) {
    return [];
  }

  const leftType = resolveNumericType(node.leftOperand, symbolTable);
  const rightType = resolveNumericType(node.rightOperand, symbolTable);

  if (
    leftType === NumericType.FLOATING_POINT ||
    rightType === NumericType.FLOATING_POINT
  ) {
    return [{
      message: "Using the modulus operator cannot be used with float operands.",
      location: node.startToken!.location,
    }];
  }

  return [];
}

function checkModulusWithZeroRhs(
  node: BinaryExpression,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.MODULUS) {
    return [];
  }

  if (!isNumberLiteral(node.rightOperand)) {
    return [];
  }

  const rightLiteral = node.rightOperand as NumberLiteral;
  if (rightLiteral.value === 0) {
    return [{
      message:
        "Using the modulus operator with a right-hand operand of zero will lead to undefined behavior.",
      location: node.startToken!.location,
      isWarning: true,
    }];
  }

  return [];
}

function checkDivisionByZero(
  node: BinaryExpression,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.DIVIDE) {
    return [];
  }

  if (!isNumberLiteral(node.rightOperand)) {
    return [];
  }

  const rightLiteral = node.rightOperand as NumberLiteral;
  if (rightLiteral.value === 0) {
    return [{
      message:
        "The value of division where the value of the second operand is zero will lead to undefined behavior.",
      location: node.startToken!.location,
      isWarning: true,
    }];
  }

  return [];
}

function checkIntegerDivisionWithNegatives(
  node: BinaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.DIVIDE) {
    return [];
  }

  const leftType = resolveNumericType(node.leftOperand, symbolTable);
  const rightType = resolveNumericType(node.rightOperand, symbolTable);

  if (leftType !== NumericType.INTEGER || rightType !== NumericType.INTEGER) {
    return [];
  }

  const leftIsNegative = isNumberLiteral(node.leftOperand) &&
    (node.leftOperand as NumberLiteral).value < 0;
  const rightIsNegative = isNumberLiteral(node.rightOperand) &&
    (node.rightOperand as NumberLiteral).value < 0;

  if (leftIsNegative || rightIsNegative) {
    return [{
      message:
        "The direction of truncation for integer division with negative operands is not defined by the SDL which will lead to undefined behavior.",
      location: node.startToken!.location,
      isWarning: true,
    }];
  }

  return [];
}

function checkRightShiftOnSignedInt(
  node: BinaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.SHIFT_RIGHT) {
    return [];
  }

  const leftType = resolveNumericType(node.leftOperand, symbolTable);
  if (leftType === NumericType.INTEGER) {
    return [{
      message:
        "The behaviour of the right shift operator applied to a signed int value is not defined by the SDL which will lead to undefined behavior.",
      location: node.startToken!.location,
      isWarning: true,
    }];
  }

  return [];
}

function checkLeftHandAssignmentConst(
  node: BinaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  if (node.binaryOperatorKind !== BinaryOperatorKind.ASSIGNMENT) {
    return [];
  }

  if (!isIdentifier(node.leftOperand)) {
    return [];
  }

  const identifier = node.leftOperand as Identifier;
  const symbol = symbolTable.lookupVariable(identifier.name);

  if (symbol && symbol.attributes.isConst) {
    return [{
      message:
        "The left-hand operand of an assignment operator cannot be a const variable.",
      location: node.startToken!.location,
    }];
  }

  return [];
}

export const checkExpressionBinary: Check = {
  nodeKind: NodeKind.EXPRESSION,
  subKind: ExpressionKind.BINARY,
  checkFunc: function (
    node: AbstractExpression,
    symbolTable: SymbolTable,
    _strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    // Only process BinaryExpression nodes
    if (node.expressionKind !== ExpressionKind.BINARY) {
      return results;
    }

    const binaryExpression = node as BinaryExpression;

    return [
      ...checkConstMutationViaAssignment(binaryExpression, symbolTable),
      ...checkModulusWithNegativeRhs(binaryExpression),
      ...checkModulusWithFloatOperands(binaryExpression, symbolTable),
      ...checkModulusWithZeroRhs(binaryExpression),
      ...checkDivisionByZero(binaryExpression),
      ...checkIntegerDivisionWithNegatives(binaryExpression, symbolTable),
      ...checkRightShiftOnSignedInt(binaryExpression, symbolTable),
      ...checkLeftHandAssignmentConst(binaryExpression, symbolTable),
    ];
  },
};
