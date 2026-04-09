import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import type { Parameter } from "../../ast/node/parameter.ts";
import type { ParameterList } from "../../ast/node/parameter-list.ts";
import { getRequiredIdentifier } from "../util/symbol-table-utils.ts";
import type { Check, CheckResult } from "./check.ts";

export const checkParameterList: Check = {
  nodeKind: NodeKind.PARAMETER_LIST,
  checkFunc: function (
    node: ParameterList,
    _symbolTable,
    strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    for (const param of node.parameters) {
      if (param.nodeKind !== NodeKind.PARAMETER) {
        continue;
      }
      const parameter = param as Parameter;

      // Check if both elementaryType and classIdentifier are undefined/null
      // This indicates a string type parameter which is not supported
      if (!parameter.elementaryType && !parameter.classIdentifier) {
        const identifier = getRequiredIdentifier(
          parameter.identifier,
          parameter,
          strict,
        );
        if (identifier) {
          results.push({
            message:
              "String variables are not supported in class parameter lists.",
            location: identifier.startToken!.location,
          });
        }
      }
    }

    return results;
  },
};
