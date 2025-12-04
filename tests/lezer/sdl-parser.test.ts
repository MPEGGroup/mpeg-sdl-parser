import fs from "node:fs";
import * as path from "path";
import { describe, test } from "bun:test";
import { createStrictSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { fileTests } from "@lezer/generator/dist/test";

const sdlParser = createStrictSdlParser();
const testCaseDir = path.join(__dirname, "./test-cases");

for (const filename of fs.readdirSync(testCaseDir)) {
  if (!/\.txt$/.test(filename)) {
    continue;
  }

  const scenarioName = /^[^\.]*/.exec(filename)?.[0] || "??";

  describe(`${scenarioName} Tests`, () => {
    const testCases = fs.readFileSync(path.join(testCaseDir, filename), "utf8");

    for (const { name, run } of fileTests(testCases, filename)) {
      test(`Test ${scenarioName} - ${name}`, () => run(sdlParser));
    }
  });
}
