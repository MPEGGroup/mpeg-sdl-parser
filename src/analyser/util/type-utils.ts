import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import { BinaryOperatorKind } from "../../ast/node/enum/binary-operator-kind.ts";
import { ElementaryTypeKind } from "../../ast/node/enum/elementary-type-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import {
  isAbstractExpression,
  isIdentifier,
  isNumberLiteral,
} from "../../ast/util/types.ts";
import { NumericType, StringType, type SymbolTable } from "../symbol-table.ts";
import { InternalScannerError } from "../../scanner-error.ts";
import { StringVariableKind } from "../../ast/node/enum/string-variable-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";

export function getNumericTypeFromElementaryTypeKind(
  kind: ElementaryTypeKind,
): NumericType {
  switch (kind) {
    case ElementaryTypeKind.INTEGER:
    case ElementaryTypeKind.UNSIGNED_INTEGER:
    case ElementaryTypeKind.BIT:
      return NumericType.INTEGER;
    case ElementaryTypeKind.FLOATING_POINT:
      return NumericType.FLOATING_POINT;
    default: {
      const exhaustiveCheck: never = kind;
      throw new InternalScannerError(
        "Unreachable code reached, kind == " + exhaustiveCheck,
      );
    }
  }
}

export function getStringTypeFromStringVariableKind(
  kind: StringVariableKind,
): StringType {
  switch (kind) {
    case StringVariableKind.BASE64:
      return StringType.BASIC;
    case StringVariableKind.UTF8:
    case StringVariableKind.UTF16:
    case StringVariableKind.UTF:
    case StringVariableKind.UTF8_LIST:
      return StringType.UCS;
    default: {
      const exhaustiveCheck: never = kind;
      throw new InternalScannerError(
        "Unreachable code reached, kind == " + exhaustiveCheck,
      );
    }
  }
}

function getNumericTypeFromNumberLiteralKind(
  kind: NumberLiteralKind,
): NumericType {
  switch (kind) {
    case NumberLiteralKind.BINARY:
    case NumberLiteralKind.HEXADECIMAL:
    case NumberLiteralKind.INTEGER:
    case NumberLiteralKind.MULTIPLE_CHARACTER:
      return NumericType.INTEGER;
    case NumberLiteralKind.FLOATING_POINT:
      return NumericType.FLOATING_POINT;
    case NumberLiteralKind.DECIMAL:
      return NumericType.DECIMAL;
    default: {
      const exhaustiveCheck: never = kind;
      throw new InternalScannerError(
        "Unreachable code reached, kind == " + exhaustiveCheck,
      );
    }
  }
}

export function resolveNumericType(
  node: AbstractNode,
  symbolTable: SymbolTable,
): NumericType | undefined {
  if (isNumberLiteral(node)) {
    return getNumericTypeFromNumberLiteralKind(node.numberLiteralKind);
  }

  if (isIdentifier(node)) {
    return resolveNumericTypeFromIdentifier(node, symbolTable);
  }

  if (isAbstractExpression(node)) {
    return resolveNumericTypeFromExpression(node, symbolTable);
  }

  throw new InternalScannerError(
    `Undexpected node kind: ${NodeKind[node.nodeKind]}`,
  );
}

function resolveNumericTypeFromIdentifier(
  identifier: Identifier,
  symbolTable: SymbolTable,
): NumericType | undefined {
  const symbol = symbolTable.lookupVariable(identifier.name);

  if (symbol && (symbol.attributes.numericType !== undefined)) {
    return symbol.attributes.numericType;
  }

  const classMembers = symbolTable.lookupClassMember(identifier.name);

  // Use the first class member as they should all have the same type in different branches
  if (classMembers && (classMembers.length > 0)) {
    const memberSymbol = classMembers[0].symbol;

    if (memberSymbol.attributes.numericType !== undefined) {
      return memberSymbol.attributes.numericType;
    }
  }

  // Identifier is not defined, there will already be an SemanticError for this
  return undefined;
}

function resolveNumericTypeFromExpression(
  expression: AbstractExpression,
  symbolTable: SymbolTable,
): NumericType | undefined {
  const kind = expression.expressionKind;

  switch (kind) {
    case ExpressionKind.BINARY:
      return resolveBinaryExpressionType(
        expression as BinaryExpression,
        symbolTable,
      );
    case ExpressionKind.UNARY:
      return resolveNumericType(
        (expression as UnaryExpression).operand,
        symbolTable,
      );
    case ExpressionKind.LENGTHOF:
      return NumericType.INTEGER;
    default: {
      const exhaustiveCheck: never = kind;
      throw new InternalScannerError(
        "Unreachable code reached, kind == " + exhaustiveCheck,
      );
    }
  }
}

function resolveBinaryExpressionType(
  expression: BinaryExpression,
  symbolTable: SymbolTable,
): NumericType | undefined {
  const operatorKind = expression.binaryOperatorKind;
  if (operatorKind === undefined) {
    return undefined;
  }

  if (isRelationalOperator(operatorKind) || isLogicalOperator(operatorKind)) {
    return NumericType.INTEGER;
  }

  if (operatorKind === BinaryOperatorKind.ASSIGNMENT) {
    return resolveNumericType(
      expression.leftOperand as AbstractNode,
      symbolTable,
    );
  }

  const leftNumericType = resolveNumericType(
    expression.leftOperand as AbstractNode,
    symbolTable,
  );
  const rightNumericType = resolveNumericType(
    expression.rightOperand as AbstractNode,
    symbolTable,
  );

  if (
    (leftNumericType === NumericType.FLOATING_POINT) ||
    (rightNumericType === NumericType.FLOATING_POINT)
  ) {
    return NumericType.FLOATING_POINT;
  }

  if (
    (leftNumericType === NumericType.DECIMAL) ||
    (rightNumericType === NumericType.DECIMAL)
  ) {
    return NumericType.DECIMAL;
  }

  if (
    (leftNumericType === NumericType.INTEGER) ||
    (rightNumericType === NumericType.INTEGER)
  ) {
    return NumericType.INTEGER;
  }

  return leftNumericType || rightNumericType;
}

export function isRelationalOperator(kind: BinaryOperatorKind): boolean {
  return (kind === BinaryOperatorKind.LESS_THAN) ||
    (kind === BinaryOperatorKind.LESS_THAN_OR_EQUAL) ||
    (kind === BinaryOperatorKind.GREATER_THAN) ||
    (kind === BinaryOperatorKind.GREATER_THAN_OR_EQUAL) ||
    (kind === BinaryOperatorKind.EQUAL) ||
    (kind === BinaryOperatorKind.NOT_EQUAL);
}

export function isLogicalOperator(kind: BinaryOperatorKind): boolean {
  return (kind === BinaryOperatorKind.LOGICAL_AND) ||
    (kind === BinaryOperatorKind.LOGICAL_OR);
}

export function isShiftOperator(kind: BinaryOperatorKind): boolean {
  return (kind === BinaryOperatorKind.SHIFT_LEFT) ||
    (kind === BinaryOperatorKind.SHIFT_RIGHT);
}

export function isBitwiseOperator(kind: BinaryOperatorKind): boolean {
  return (kind === BinaryOperatorKind.BITWISE_AND) ||
    (kind === BinaryOperatorKind.BITWISE_OR);
}

export function isArithmeticOperator(kind: BinaryOperatorKind): boolean {
  return (kind === BinaryOperatorKind.ADD) ||
    (kind === BinaryOperatorKind.SUBTRACT) ||
    (kind === BinaryOperatorKind.MULTIPLY) ||
    (kind === BinaryOperatorKind.DIVIDE) ||
    (kind === BinaryOperatorKind.MODULUS);
}
