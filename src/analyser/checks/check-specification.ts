import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { Specification } from "../../ast/node/specification.ts";
import type { ComputedElementaryTypeDefinition } from "../../ast/node/computed-elementary-type-definition.ts";
import { isStatement } from "../../ast/util/types.ts";
import type { Check, CheckResult } from "./check.ts";

export const checkSpecification: Check = {
  nodeKind: NodeKind.SPECIFICATION,
  checkFunc: function (
    node: Specification,
    _symbolTable,
    _strict,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    for (const child of node.children) {
      if (!isStatement(child)) {
        continue;
      }

      const statement = child;

      if (
        statement.statementKind ===
          StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION
      ) {
        const definition = statement as ComputedElementaryTypeDefinition;
        if (definition.constKeyword === undefined) {
          results.push({
            message:
              "The only items that may be present in global scope are: constant computed elementary variable definitions, map declarations, class declarations.",
            location: child.startToken?.getLocation() ||
              child.leadingTrivia?.[0]?.location!,
          });
        }
      } else if (statement.statementKind === StatementKind.MAP_DECLARATION) {
        continue;
      } else if (statement.statementKind === StatementKind.CLASS_DECLARATION) {
        continue;
      } else {
        results.push({
          message:
            "The only items that may be present in global scope are: constant computed elementary variable definitions, map declarations, class declarations.",
          location: child.startToken?.getLocation() ||
            child.leadingTrivia?.[0]?.location!,
        });
      }
    }

    return results;
  },
};
