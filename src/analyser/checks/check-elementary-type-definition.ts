import type { LengthAttribute } from "../../../dist/index.js";
import type { ElementaryTypeDefinition } from "../../ast/node/elementary-type-definition.ts";
import { ElementaryTypeKind } from "../../ast/node/enum/elementary-type-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { NumberLiteral } from "../../ast/node/number-literal.ts";
import { isNumberLiteral } from "../../ast/util/types.ts";
import {
  getElementaryTypeKind,
  getRequiredElementaryType,
} from "../util/symbol-table-utils.ts";
import type { Check, CheckResult } from "./check.ts";

function checkOptionalCannotDefineRange(
  definition: ElementaryTypeDefinition,
): CheckResult[] {
  if (
    definition.assignmentOperator === undefined &&
    definition.rangeOperator !== undefined
  ) {
    const location = definition.startToken?.location;
    if (location) {
      return [{
        message:
          "An optional elementary type definition cannot define a range for a value.",
        location,
      }];
    }
  }
  return [];
}

function checkRangeMinMaxValidation(
  definition: ElementaryTypeDefinition,
): CheckResult[] {
  if (
    definition.value && definition.endValue &&
    isNumberLiteral(definition.value) && isNumberLiteral(definition.endValue)
  ) {
    const minValue = definition.value as NumberLiteral;
    const maxValue = definition.endValue as NumberLiteral;

    // Check that types match
    if (minValue.numberLiteralKind !== maxValue.numberLiteralKind) {
      const location = maxValue.startToken?.location ||
        definition.startToken!.location;
      if (location) {
        return [{
          message:
            "The min_value and max_value must be of the same type and the max_value must be greater than or equal to the min_value.",
          location,
        }];
      }
    }

    // Check that max >= min
    if (maxValue.value < minValue.value) {
      const location = maxValue.startToken?.location ||
        definition.startToken!.location;
      if (location) {
        return [{
          message:
            "The min_value and max_value must be of the same type and the max_value must be greater than or equal to the min_value.",
          location,
        }];
      }
    }
  }
  return [];
}

function checkValueRepresentability(
  definition: ElementaryTypeDefinition,
  strict: boolean,
): CheckResult[] {
  const elementaryType = getRequiredElementaryType(
    definition.elementaryType,
    definition,
    strict,
  );

  if (!elementaryType) {
    return [];
  }

  const elementaryTypeKind = getElementaryTypeKind(elementaryType, strict);
  if (elementaryTypeKind === undefined) {
    return [];
  }

  // Get bit width from length attribute
  if (
    !definition.lengthAttribute ||
    definition.lengthAttribute.nodeKind !== NodeKind.LENGTH_ATTRIBUTE
  ) {
    return [];
  }

  const lengthAttribute = definition.lengthAttribute as LengthAttribute;
  if (!isNumberLiteral(lengthAttribute.length)) {
    return [];
  }

  const lengthLiteral = lengthAttribute.length as NumberLiteral;
  const bitWidth = lengthLiteral.value;

  // Check if value is a NumberLiteral
  if (definition.value && isNumberLiteral(definition.value)) {
    const valueLiteral = definition.value as NumberLiteral;
    const value = valueLiteral.value;

    let isValid = false;

    switch (elementaryTypeKind) {
      case ElementaryTypeKind.UNSIGNED_INTEGER:
      case ElementaryTypeKind.BIT:
        isValid = value >= 0 && value < Math.pow(2, bitWidth);
        break;
      case ElementaryTypeKind.INTEGER: {
        const minSigned = -Math.pow(2, bitWidth - 1);
        const maxSigned = Math.pow(2, bitWidth - 1);
        isValid = value >= minSigned && value < maxSigned;
        break;
      }
      case ElementaryTypeKind.FLOATING_POINT:
        isValid = true;
        break;
      default:
        isValid = false;
        break;
    }

    if (!isValid) {
      const location = valueLiteral.startToken?.location ||
        definition.startToken!.location;
      if (location) {
        return [{
          message:
            "The specified value cannot be represented using the specific width of the variable.",
          location,
        }];
      }
    }
  }

  return [];
}

export const checkElementaryTypeDefinition: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.ELEMENTARY_TYPE_DEFINITION,
  checkFunc: function (
    definition: ElementaryTypeDefinition,
    _symbolTable,
    strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    results.push(...checkOptionalCannotDefineRange(definition));

    results.push(...checkRangeMinMaxValidation(definition));

    results.push(...checkValueRepresentability(definition, strict));

    return results;
  },
};
