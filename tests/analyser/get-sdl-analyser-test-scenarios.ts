function toLineContext(file: string, index: number): string {
  const endEol = file.indexOf("\n", index + 80);
  const endIndex = endEol === -1 ? file.length : endEol;

  return file.substring(index, endIndex).split(/\n/).map((str) => "  | " + str)
    .join("\n");
}

export interface TestScenario {
  name: string;
  text: string;
  expected: string;
  expectedErrors: string;
}

export function getSdlAnalyserTestScenarios(file: string, fileName: string) {
  const scenarioExpr =
    /\s*#[ \t]*(.*)(?:\r\n|\r|\n)([^]*?)==+>([^]*?)(?:\s*$|(?:\r\n|\r|\n)+(?=#))/gy;
  const testScenarios: Array<TestScenario> = [];
  let lastIndex = 0;

  for (;;) {
    const scenarioRegexResult = scenarioExpr.exec(file);

    if (!scenarioRegexResult) {
      throw new Error(
        `Unexpected file format in ${fileName} around\n\n${
          toLineContext(file, lastIndex)
        }`,
      );
    }

    const name = scenarioRegexResult[1].trim();
    const text = scenarioRegexResult[2].trim();
    const rawExpected = scenarioRegexResult[3];
    const errorSplit = rawExpected.split(/errors:/);
    const expected = errorSplit[0].trim();
    const expectedErrors = (errorSplit[1] ?? "").trim();

    testScenarios.push({
      name,
      text,
      expected,
      expectedErrors,
    });

    lastIndex = scenarioRegexResult.index + scenarioRegexResult[0].length;

    if (lastIndex == file.length) {
      break;
    }
  }

  return testScenarios;
}
