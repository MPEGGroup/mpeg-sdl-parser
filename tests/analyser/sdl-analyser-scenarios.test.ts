import fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "bun:test";
import { createStrictSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { getSdlAnalyserTestScenarios } from "./get-sdl-analyser-test-scenarios.ts";
import { createLenientSdlAnalyser } from "../../src/analyser/create-sdl-analyser.ts";
import { buildAst } from "../../src/ast/build-ast.ts";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";
import { getSymbolTableString } from "../../src/analyser/util/symbol-table-utils.ts";
import type { Specification } from "../../src/ast/node/specification.ts";

const sdlParser = createStrictSdlParser();
const sdlAnalyser = createLenientSdlAnalyser(undefined);
const testCaseDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "test-cases",
);

const normalize = (s: string) => s.replace(/\r\n/g, "\n");

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
        const expectedOutput = normalize(testScenario.expected.trim());

        const sdlStringInput = new SdlStringInput(sdlString);
        const parseTree = sdlParser.parse(sdlStringInput);
        const specification = buildAst(parseTree, sdlStringInput);
        const actualAnalysisResult = sdlAnalyser.analyse(
          specification as Specification,
        );
        const actualOutput = normalize(getSymbolTableString(
          actualAnalysisResult.symbolTable,
        ));

        expect(actualOutput).toBe(expectedOutput);

        const actualErrors = actualAnalysisResult.semanticErrors
          .map((e) => e.errorMessage)
          .join("\n");
        const expectedErrors = normalize(testScenario.expectedErrors);

        expect(actualErrors).toBe(expectedErrors);

        const actualWarnings = actualAnalysisResult.semanticWarnings
          .map((e) => e.errorMessage)
          .join("\n");
        const expectedWarnings = normalize(testScenario.expectedWarnings);

        expect(actualWarnings).toBe(expectedWarnings);
      });
    }
  });
}
