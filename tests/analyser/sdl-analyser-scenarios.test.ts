import fs from "node:fs";
import * as path from "path";
import { describe, expect, test } from "bun:test";
import { createStrictSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { getSdlAnalyserTestScenarios } from "./get-sdl-analyser-test-scenarios.ts";
import { createLenientSdlAnalyser } from "../../src/analyser/create-sdl-analyser.ts";
import { buildAst } from "../../src/ast/build-ast.ts";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";
import type { Specification } from "../../dist/index.js";

const sdlParser = createStrictSdlParser();
const sdlAnalyser = createLenientSdlAnalyser();
const testCaseDir = path.join(__dirname, "./test-cases");

for (const filename of fs.readdirSync(testCaseDir)) {
  if (!/\.txt$/.test(filename)) {
    continue;
  }

  const scenarioName = /^[^\.]*/.exec(filename)?.[0] || "??";

  describe(`SDL Analyser ${scenarioName} Tests`, () => {
    const testCases = fs.readFileSync(path.join(testCaseDir, filename), "utf8");

    for (
      const testScenario of getSdlAnalyserTestScenarios(testCases, filename)
    ) {
      test(`Test SDL Analyser ${scenarioName} - ${testScenario.name}`, () => {
        const sdlString = testScenario.text.trim();
        const expectedOutput = testScenario.expected.trim();

        const sdlStringInput = new SdlStringInput(sdlString);
        const parseTree = sdlParser.parse(sdlStringInput);
        const specification = buildAst(parseTree, sdlStringInput);
        const actualAnalysisResult = sdlAnalyser.analyse(
          specification as Specification,
        );
        const actualOutput = actualAnalysisResult.symbolTable.toString().trim();

        expect(actualOutput).toBe(expectedOutput);

        const actualErrors = actualAnalysisResult.semanticErrors
          .map((e) => e.errorMessage)
          .join("\n");
        const expectedErrors = testScenario.expectedErrors;

        expect(actualErrors).toBe(expectedErrors);
      });
    }
  });
}
