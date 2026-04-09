import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import type { NumberLiteral } from "../../ast/node/number-literal.ts";
import type { Check, CheckResult } from "./check.ts";

export const checkNumberLiteralFloat: Check = {
  nodeKind: NodeKind.NUMBER_LITERAL,
  subKind: NumberLiteralKind.FLOATING_POINT,
  checkFunc: function (
    node: NumberLiteral,
    _symbolTable,
    _strict,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    if (Object.is(node.value, -0)) {
      results.push({
        message:
          "Usage of signed zero for a floating point literal will lead to undefined behaviour.",
        location: node.startToken?.getLocation() ||
          node.leadingTrivia?.[0]?.location!,
        isWarning: true,
      });
    }

    return results;
  },
};
