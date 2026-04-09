import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import type { LengthofExpression } from "../../ast/node/length-of-expression.ts";
import { isIdentifier } from "../../ast/util/types.ts";
import type { Check, CheckResult } from "./check.ts";

export const checkExpressionLengthof: Check = {
  nodeKind: NodeKind.EXPRESSION,
  subKind: ExpressionKind.LENGTHOF,
  checkFunc: function (
    node: LengthofExpression,
    symbolTable,
    _strict,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    // Check if operand is an identifier
    if (isIdentifier(node.operand)) {
      // Look up the variable in the symbol table
      const variable = symbolTable.lookupVariable(node.operand.name);

      // If variable exists and is computed, report error
      if (variable && variable.attributes.isComputed) {
        results.push({
          message:
            "The lengthof operator cannot be used with a computed variable.",
          location: node.operand.startToken!.location,
        });
      }
    }

    return results;
  },
};
