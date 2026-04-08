import {
  InternalScannerError,
  SemanticError,
  SemanticWarning,
} from "../../scanner-error.ts";
import { NumericType, type SymbolTable } from "../symbol-table.ts";
import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import type { ClassDefinition } from "../../ast/node/class-definition.ts";
import type { ElementaryTypeDefinition } from "../../ast/node/elementary-type-definition.ts";
import type { ComputedElementaryTypeDefinition } from "../../ast/node/computed-elementary-type-definition.ts";
import type { Token } from "../../ast/node/token.ts";
import type { ParameterList } from "../../ast/node/parameter-list.ts";
import type { Parameter } from "../../ast/node/parameter.ts";
import type { ParameterValueList } from "../../ast/node/parameter-value-list.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import {
  getElementaryTypeKind,
  getRequiredIdentifier,
  getRequiredOperand,
  getRequiredToken,
} from "../util/symbol-table-utils.ts";
import {
  isElementaryType,
  isIdentifier,
  type OneToManyList,
} from "../../ast/util/types.ts";
import {
  getNumericTypeFromElementaryTypeKind,
  isArithmeticOperator,
  isBitwiseOperator,
  isLogicalOperator,
  isRelationalOperator,
  isShiftOperator,
  resolveNumericType,
} from "../util/type-utils.ts";
import { BinaryOperatorKind } from "../../ast/node/enum/binary-operator-kind.ts";
import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import type { NumberLiteral } from "../../ast/node/number-literal.ts";
import type { Identifier } from "../../ast/node/identifier.ts";

export class ValidateTypeNodeHandler extends AbstractAnalysisNodeHandler {
  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(symbolTable, strict);

    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.BINARY,
      (node) => this.validateBinaryExpression(node as BinaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.UNARY,
      (node) => this.validateUnaryExpression(node as UnaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.ELEMENTARY_TYPE_DEFINITION,
      (node) =>
        this.validateElementaryTypeDefinition(node as ElementaryTypeDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION,
      (node) =>
        this.validateComputedElementaryTypeDefinition(
          node as ComputedElementaryTypeDefinition,
        ),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.CLASS_DEFINITION,
      (node) => this.validateClassDefinition(node as ClassDefinition),
    );
  }

  private validateClassDefinition(classDefinition: ClassDefinition): void {
    if (!classDefinition.parameterValueList) {
      return;
    }

    const classIdentifier = getRequiredIdentifier(
      classDefinition.classIdentifier,
      classDefinition,
      this.strict,
    );

    if (!classIdentifier) {
      return;
    }

    const classSymbol = this.symbolTable.lookupClass(classIdentifier.name);

    if (!classSymbol) {
      return;
    }

    const identifier = getRequiredIdentifier(
      classDefinition.classIdentifier,
      classDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const classDeclaration = classSymbol.node as ClassDeclaration;

    let parameters: Parameter[] = [];

    if (classDeclaration.parameterList) {
      const parameterList = classDeclaration.parameterList as ParameterList;
      parameters = parameterList.parameters.filter(
        (p): p is Parameter => p.nodeKind === NodeKind.PARAMETER,
      );
    }

    let values: OneToManyList<AbstractExpression | Identifier | NumberLiteral> =
      [];

    if (classDefinition.parameterValueList) {
      const valueList = classDefinition
        .parameterValueList as ParameterValueList;
      values = valueList.values;
    }

    if ((parameters.length === 0) && (values.length > 0)) {
      const error = new SemanticError(
        `Class '${classIdentifier.name}' does not expect parameters, but ${values.length} provided`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);

      return;
    }

    if ((parameters.length > 0) && (values.length === 0)) {
      const error = new SemanticError(
        `Class '${classIdentifier.name}' expects ${parameters.length} parameter(s), but none provided`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);

      return;
    }

    if (values.length !== parameters.length) {
      const error = new SemanticError(
        `Class '${classIdentifier.name}' expects ${parameters.length} parameter(s), but ${values.length} provided`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);

      return;
    }

    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      const parameterIdentifier = getRequiredIdentifier(
        parameter.identifier,
        parameter,
        false,
      );

      if (!parameterIdentifier) {
        continue;
      }

      const value = values[i] as AbstractNode;

      let error: SemanticError | undefined = undefined;
      let warning: SemanticWarning | undefined = undefined;

      if (isElementaryType(parameter.elementaryType)) {
        const elementaryTypeKind = getElementaryTypeKind(
          parameter.elementaryType,
          false,
        );

        if (elementaryTypeKind !== undefined) {
          const parameterNumericType = getNumericTypeFromElementaryTypeKind(
            elementaryTypeKind,
          );
          const valueNumericType = resolveNumericType(
            value,
            this.symbolTable,
          );

          // If the type cannot be determined (due to identifier not being defined etc.)
          // then just continue as there will already be a semantic error undefined symbol
          if (
            (valueNumericType === undefined) ||
            (parameterNumericType === undefined)
          ) {
            continue;
          } else if (valueNumericType !== parameterNumericType) {
            warning = new SemanticWarning(
              `Coercion required: parameter type: ${
                NumericType[parameterNumericType]
              }, value type: ${NumericType[valueNumericType]}`,
              value.getLocation(),
            );
          }
        }
      } else if (isIdentifier(parameter.classIdentifier)) {
        const parameterClassSymbol = this.symbolTable.lookupClass(
          parameter.classIdentifier.name,
        );

        if (parameterClassSymbol) {
          const valueClassIdentifier = isIdentifier(value) ? value : undefined;

          if (valueClassIdentifier) {
            const valueClassSymbol = this.symbolTable.lookupClass(
              valueClassIdentifier.name,
            );

            if (valueClassSymbol) {
              // make sure the class declarations are the same by comparing valueClassSymbol.attributes.classType with parameterClassSymbol.attributes.classType
              if (valueClassSymbol.attributes.classType === undefined) {
                error = new SemanticError(
                  `Class type could not be resolved for value of parameter '${parameterIdentifier.name}'`,
                  value.getLocation(),
                );
              } else if (
                parameterClassSymbol.attributes.classType === undefined
              ) {
                error = new SemanticError(
                  `Class type could not be resolved for parameter '${parameterIdentifier.name}'`,
                  parameterIdentifier.getLocation(),
                );
              } else if (
                valueClassSymbol.attributes.classType !==
                  parameterClassSymbol.attributes.classType
              ) {
                warning = new SemanticWarning(
                  `Coercion required: parameter class type: ${parameterClassSymbol.attributes.classType}, value class type: ${valueClassSymbol.attributes.classType}`,
                  value.getLocation(),
                );
              }
            }
          }
        }
      } else {
        continue;
      }

      if (warning) {
        this.semanticWarnings.push(warning);
      }

      if (error) {
        if (this.strict) {
          throw error;
        }

        this.semanticErrors.push(error);
      }
    }
  }

  private validateElementaryTypeDefinition(
    elementaryTypeDefinition: ElementaryTypeDefinition,
  ): void {
    this.validateElementaryTypeValueAndEndValue(elementaryTypeDefinition);
  }

  private validateComputedElementaryTypeDefinition(
    computedElementaryTypeDefinition: ComputedElementaryTypeDefinition,
  ): void {
    this.validateElementaryTypeValueAndEndValue(
      computedElementaryTypeDefinition,
    );
  }

  private validateElementaryTypeValueAndEndValue(
    definition: ElementaryTypeDefinition | ComputedElementaryTypeDefinition,
  ): void {
    // nothing to check if no value provided
    if (definition.value === undefined) {
      return;
    }

    const identifier = getRequiredIdentifier(
      definition.identifier,
      definition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    // get the symbol using the identifier.name
    const symbol = this.symbolTable.lookupVariable(identifier.name);

    if (!symbol) {
      return;
    }

    const declaredType = symbol.attributes.numericType;

    if (!declaredType) {
      return;
    }

    const valueType = resolveNumericType(definition.value, this.symbolTable);

    // If the type cannot be determined (due to identifier not being defined etc.)
    // then just continue as there will already be a semantic error undefined symbol
    if ((valueType !== undefined) && (valueType !== declaredType)) {
      const warning = new SemanticWarning(
        `Type coercion required for '${identifier.name}' value: expected ${
          NumericType[declaredType]
        }, got ${NumericType[valueType!]}`,
        identifier.startToken!.location,
      );

      this.semanticWarnings.push(warning);
    }

    // nothing further to check if no end value provided
    if (!(definition as ElementaryTypeDefinition).endValue) {
      return;
    }

    const endValueType = resolveNumericType(
      (definition as ElementaryTypeDefinition).endValue!,
      this.symbolTable,
    );

    // If the type cannot be determined (due to identifier not being defined etc.)
    // then just continue as there will already be a semantic error undefined symbol
    if ((endValueType !== undefined) && (endValueType !== declaredType)) {
      const warning = new SemanticWarning(
        `Type coercion required for '${identifier.name}' end value: expected ${
          NumericType[declaredType]
        }, got ${NumericType[endValueType!]}`,
        identifier.startToken!.location,
      );

      this.semanticWarnings.push(warning);
    }
  }

  private validateBinaryExpression(binaryExpression: BinaryExpression): void {
    const leftOperand = getRequiredOperand(
      binaryExpression.leftOperand,
      binaryExpression,
      this.strict,
    );

    if (!leftOperand) {
      return;
    }

    const rightOperand = getRequiredOperand(
      binaryExpression.rightOperand,
      binaryExpression,
      this.strict,
    );

    if (!rightOperand) {
      return;
    }

    const operatorToken = getRequiredToken(
      binaryExpression.binaryOperator,
      binaryExpression,
      this.strict,
    );

    if (!operatorToken) {
      return;
    }

    const operatorKind = binaryExpression.binaryOperatorKind;

    if (operatorKind === undefined) {
      throw new InternalScannerError(
        "Unreachable code reached, operatorKind is undefined",
      );
    }

    const leftOperandNumericType = resolveNumericType(
      leftOperand,
      this.symbolTable,
    );
    const rightOperandNumericType = resolveNumericType(
      rightOperand,
      this.symbolTable,
    );

    // If the type cannot be determined (due to identifier not being defined etc.)
    // then just return as there will already be a semantic error undefined symbol
    if (
      (leftOperandNumericType === undefined) ||
      (rightOperandNumericType === undefined)
    ) {
      return;
    }

    let isCoercionRequired = false;

    if (
      (operatorKind === BinaryOperatorKind.ASSIGNMENT) ||
      isArithmeticOperator(operatorKind) ||
      isRelationalOperator(operatorKind) || isLogicalOperator(operatorKind)
    ) {
      isCoercionRequired = leftOperandNumericType !== rightOperandNumericType;
    }

    if (isShiftOperator(operatorKind) || isBitwiseOperator(operatorKind)) {
      if (
        (leftOperandNumericType !== NumericType.INTEGER) ||
        (rightOperandNumericType !== NumericType.INTEGER)
      ) {
        isCoercionRequired = true;
      }
    }

    if (isCoercionRequired) {
      const warning = new SemanticWarning(
        `Different types in binary expression, coercion required: ${
          NumericType[leftOperandNumericType]
        } vs ${NumericType[rightOperandNumericType]}`,
        operatorToken.location,
      );
      this.semanticWarnings.push(warning);
    }
  }

  private validateUnaryExpression(unaryExpression: UnaryExpression): void {
    const operand = getRequiredOperand(
      unaryExpression.operand,
      unaryExpression,
      this.strict,
    );

    if (!operand) {
      return;
    }

    const operandNumericType = resolveNumericType(
      operand,
      this.symbolTable,
    );
    // If the type cannot be determined (due to identifier not being defined etc.)
    // then just return as there will already be a semantic error undefined symbol
    if (operandNumericType === undefined) {
      return;
    }

    if (unaryExpression.postfixOperator) {
      const token = unaryExpression.postfixOperator as Token;

      if (
        (token.tokenKind === TokenKind.POSTFIX_INCREMENT) ||
        (token.tokenKind === TokenKind.POSTFIX_DECREMENT)
      ) {
        if (operandNumericType !== NumericType.INTEGER) {
          const warning = new SemanticWarning(
            `Non-integer ${
              token.tokenKind === TokenKind.POSTFIX_INCREMENT
                ? "increment"
                : "decrement"
            } operand, coercion required: ${NumericType[operandNumericType]}`,
            token.location,
          );
          this.semanticWarnings.push(warning);
        }
      }
    }
  }
}
