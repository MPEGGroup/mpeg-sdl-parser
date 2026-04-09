import type { ArrayDefinition } from "../../ast/node/array-definition.ts";
import type { ArrayElementAccess } from "../../ast/node/array-element-access.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import { isIdentifier } from "../../ast/util/types.ts";
import type { SymbolTable } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { Token } from "../../ast/node/token.ts";
import type { Identifier } from "../../ast/node/identifier.ts";

function checkConstMutationViaPostfix(
  expression: UnaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (
    expression.postfixOperator !== undefined &&
    ((expression.postfixOperator as Token).tokenKind ===
        TokenKind.POSTFIX_INCREMENT ||
      (expression.postfixOperator as Token).tokenKind ===
        TokenKind.POSTFIX_DECREMENT)
  ) {
    let targetIdentifier: Identifier | undefined;
    if (isIdentifier(expression.operand)) {
      targetIdentifier = expression.operand;
    } else if (
      expression.operand.nodeKind === NodeKind.EXPRESSION &&
      isIdentifier((expression.operand as UnaryExpression).operand)
    ) {
      targetIdentifier = (expression.operand as UnaryExpression)
        .operand as Identifier;
    }

    if (targetIdentifier) {
      const variable = symbolTable.lookupVariable(targetIdentifier.name);

      if (
        variable &&
        variable.attributes.isConst &&
        variable.attributes.isComputed
      ) {
        results.push({
          message: "a const computed variable cannot be mutated.",
          location: (expression.postfixOperator as Token).location,
        });
      }
    }
  }

  return results;
}

function checkArrayDimensionCountMismatch(
  expression: UnaryExpression,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (expression.arrayElementAccess && isIdentifier(expression.operand)) {
    const variable = symbolTable.lookupVariable(expression.operand.name);

    if (variable && variable.attributes.isArray) {
      // Get the array definition from the symbol's AST node
      const arrayDefinition = variable.node as ArrayDefinition;

      // Count dimensions in the array definition
      let definedDimensions = 0;
      if (arrayDefinition.implicitArrayDimension) {
        definedDimensions++;
      }
      definedDimensions += arrayDefinition.dimensions.length;

      // Count dimensions in the array element access chain
      let accessDimensions = 0;

      const currentAccess = expression.arrayElementAccess as
        | ArrayElementAccess
        | undefined;

      while (currentAccess) {
        accessDimensions++;
        // Check if this access has a chained access (not directly available in the AST structure)
        // In SDL, array access is typically flattened, so we count each access node
        break;
      }

      if (definedDimensions !== accessDimensions) {
        results.push({
          message:
            "The number of dimensions used when accessing an array element must match the number of dimensions in the array definition.",
          location: expression.startToken!.location!,
        });
      }
    }
  }

  return results;
}

function checkUninitializedComputedVariableAccess(
  expression: UnaryExpression,
  _symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (isIdentifier(expression.operand)) {
    const variable = _symbolTable.lookupVariable(expression.operand.name);

    if (variable && variable.attributes.isComputed) {
      // Check if the variable definition has no initial value
      // For computed variables, this would be AbstractElementaryTypeDefinition
      if (
        (variable.node.nodeKind === NodeKind.STATEMENT) &&
        ((variable.node as AbstractStatement).statementKind ===
          StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION)
      ) {
        const definition = variable.node as { value?: unknown };

        if (!definition.value) {
          results.push({
            message:
              "Accessing a computed variable value before it is initialised will result in undefined behaviour.",
            location: expression.operand.startToken?.location ||
              expression.operand.leadingTrivia?.[0]?.location!,
            isWarning: true,
          });
        }
      }
    }
  }

  return results;
}

export const checkExpressionUnary: Check = {
  nodeKind: NodeKind.EXPRESSION,
  subKind: ExpressionKind.UNARY,
  checkFunc: function (
    expression: UnaryExpression,
    symbolTable: SymbolTable,
    _strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    results.push(...checkConstMutationViaPostfix(expression, symbolTable));
    results.push(...checkArrayDimensionCountMismatch(expression, symbolTable));
    results.push(
      ...checkUninitializedComputedVariableAccess(expression, symbolTable),
    );

    return results;
  },
};
