import { SdlAnalyser } from "./sdl-analyser.ts";

let lenientSdlAnalyser: SdlAnalyser | undefined;
let strictSdlAnalyser: SdlAnalyser | undefined;

/**
 * Create a lenient SDL analyser using default checks and store it as a "singleton".
 */
export function createLenientSdlAnalyser(): SdlAnalyser {
  if (!lenientSdlAnalyser) {
    lenientSdlAnalyser = new SdlAnalyser();

    // Configure the parser with default checks
    lenientSdlAnalyser = lenientSdlAnalyser.configure({
      checks: [],
    });
  }

  return lenientSdlAnalyser;
}

/**
 * Create a strict SDL analyser using default checks and store it as a "singleton".
 */
export function createStrictSdlAnalyser(): SdlAnalyser {
  if (!strictSdlAnalyser) {
    strictSdlAnalyser = new SdlAnalyser();

    // Configure the parser with default checks
    strictSdlAnalyser = strictSdlAnalyser.configure({
      checks: [],
      strict: true,
    });
  }

  return strictSdlAnalyser;
}
