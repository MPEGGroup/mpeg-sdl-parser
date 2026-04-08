import type { Check } from "./checks/check.ts";
import { checkComputedElementaryTypeDefinition } from "./checks/check-computed-elementary-type-definition.ts";
import { SdlAnalyser } from "./sdl-analyser.ts";

let lenientSdlAnalyser: SdlAnalyser | undefined;
let strictSdlAnalyser: SdlAnalyser | undefined;

export const defaultChecks: Check[] = [
  checkComputedElementaryTypeDefinition
];

/**
 * Create a lenient SDL analyser and store it as a "singleton".
 * 
 * @param checks Optional `Check` implementations to use in the analyser. If not supplied `defaultChecks` will be applied.
 *   NOTE: When passing a value for `checks`, `defaultChecks` must be included in this value if they are to be applied.
 */
export function createLenientSdlAnalyser(checks: Check[] | undefined): SdlAnalyser {
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
export function createStrictSdlAnalyser(checks: Check[] | undefined): SdlAnalyser {
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
