import type { Check } from "./checks/check.ts";
import { checkArrayDefinition } from "./checks/check-array-definition.ts";
import { checkArrayElementAccess } from "./checks/check-array-element-access.ts";
import { checkClassDeclaration } from "./checks/check-class-declaration.ts";
import { checkComputedArrayDefinition } from "./checks/check-computed-array-definition.ts";
import { checkComputedElementaryTypeDefinition } from "./checks/check-computed-elementary-type-definition.ts";
import { checkElementaryTypeDefinition } from "./checks/check-elementary-type-definition.ts";
import { checkExpressionBinary } from "./checks/check-expression-binary.ts";
import { checkExpressionLengthof } from "./checks/check-expression-lengthof.ts";
import { checkExpressionUnary } from "./checks/check-expression-unary.ts";
import { checkIdentifier } from "./checks/check-identifier.ts";
import { checkIfStatement } from "./checks/check-if-statement.ts";
import { checkMapDeclaration } from "./checks/check-map-declaration.ts";
import { checkMapDefinition } from "./checks/check-map-definition.ts";
import { checkSwitchStatement } from "./checks/check-switch-statement.ts";
import { checkNumberLiteralFloat } from "./checks/check-number-literal-float.ts";
import { checkParameterList } from "./checks/check-parameter-list.ts";
import { checkSpecification } from "./checks/check-specification.ts";
import { SdlAnalyser } from "./sdl-analyser.ts";

let lenientSdlAnalyser: SdlAnalyser | undefined;
let strictSdlAnalyser: SdlAnalyser | undefined;

export const defaultChecks: Check[] = [
  checkComputedElementaryTypeDefinition,
  checkSpecification,
  checkMapDeclaration,
  checkMapDefinition,
  checkClassDeclaration,
  checkParameterList,
  checkArrayDefinition,
  checkComputedArrayDefinition,
  checkElementaryTypeDefinition,
  checkIdentifier,
  checkExpressionUnary,
  checkExpressionBinary,
  checkExpressionLengthof,
  checkNumberLiteralFloat,
  checkArrayElementAccess,
  checkIfStatement,
  checkSwitchStatement,
];

/**
 * Create a lenient SDL analyser and store it as a "singleton".
 *
 * @param checks Optional `Check` implementations to use in the analyser. If not supplied `defaultChecks` will be applied.
 *   NOTE: When passing a value for `checks`, `defaultChecks` must be included in this value if they are to be applied.
 */
export function createLenientSdlAnalyser(
  checks: Check[] | undefined,
): SdlAnalyser {
  if (!lenientSdlAnalyser) {
    lenientSdlAnalyser = new SdlAnalyser();

    // Configure the parser with default checks
    lenientSdlAnalyser = lenientSdlAnalyser.configure({
      checks: checks || defaultChecks,
    });
  }

  return lenientSdlAnalyser;
}

/**
 * Create a strict SDL analyser and store it as a "singleton".
 *
 * @param checks Optional `Check` implementations to use in the analyser. If not supplied `defaultChecks` will be applied.
 *   NOTE: When passing a value for `checks`, `defaultChecks` must be included in this value if they are to be applied.
 */
export function createStrictSdlAnalyser(
  checks: Check[] | undefined,
): SdlAnalyser {
  if (!strictSdlAnalyser) {
    strictSdlAnalyser = new SdlAnalyser();

    // Configure the parser with default checks
    strictSdlAnalyser = strictSdlAnalyser.configure({
      checks: checks || defaultChecks,
      strict: true,
    });
  }

  return strictSdlAnalyser;
}
