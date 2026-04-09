import type { ComputedArrayDefinition } from "../../ast/node/computed-array-definition.ts";
import type { ExplicitArrayDimension } from "../../ast/node/explicit-array-dimension.ts";
import { ArrayDimensionKind } from "../../ast/node/enum/array-dimension-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { isNumberLiteral } from "../../ast/util/types.ts";
import type { Check, CheckResult } from "./check.ts";

export const checkComputedArrayDefinition: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.COMPUTED_ARRAY_DEFINITION,
  checkFunc: function (
    definition: ComputedArrayDefinition,
    _symbolTable,
    _strict,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    for (const dimension of definition.dimensions) {
      if (dimension.nodeKind === NodeKind.ARRAY_DIMENSION) {
        const explicitDimension = dimension as ExplicitArrayDimension;
        if (
          explicitDimension.arrayDimensionKind === ArrayDimensionKind.EXPLICIT
        ) {
          const size = explicitDimension.size;
          if (isNumberLiteral(size)) {
            if (
              size.value <= 0 ||
              size.numberLiteralKind !== NumberLiteralKind.INTEGER
            ) {
              results.push({
                message: "Array dimensions must be a positive integer.",
                location: size.startToken!.getLocation(),
              });
            }
          }
        }
      }
    }

    return results;
  },
};
