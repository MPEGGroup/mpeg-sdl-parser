import type { ArrayElementAccess } from "../../ast/node/array-element-access.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import { isNumberLiteral } from "../../ast/util/types.ts";
import type { Check, CheckResult } from "./check.ts";

export const checkArrayElementAccess: Check = {
  nodeKind: NodeKind.ARRAY_ELEMENT_ACCESS,
  checkFunc: function (
    node: ArrayElementAccess,
    _symbolTable,
    _strict,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    if (isNumberLiteral(node.index)) {
      if (
        node.index.numberLiteralKind === NumberLiteralKind.FLOATING_POINT ||
        node.index.value < 0
      ) {
        results.push({
          message:
            "Array element access cannot be performed with floating point or negative integer values.",
          location: node.index.startToken!.getLocation(),
        });
      }
    }

    return results;
  },
};
