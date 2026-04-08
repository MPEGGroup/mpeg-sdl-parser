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
  expectedWarnings: string;
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
    let rawExpected = scenarioRegexResult[3];

    let expected = "";
    let expectedErrors = "";
    let expectedWarnings = "";

    if (rawExpected.includes("errors:")) {
      let expectedSplit = rawExpected.split(/errors:/);

      expected = expectedSplit[0].trim();
      rawExpected = expectedSplit[1] ?? "";

      if (rawExpected.includes("warnings:")) {
        expectedSplit = rawExpected.split(/warnings:/);
        expectedErrors = (expectedSplit[0] ?? "").trim();
        expectedWarnings = (expectedSplit[1] ?? "").trim();
      } else {
        expectedErrors = rawExpected.trim();
      }
    } else if (rawExpected.includes("warnings")) {
      const expectedSplit = rawExpected.split(/warnings:/);

      expected = expectedSplit[0].trim();
      expectedWarnings = (expectedSplit[1] ?? "").trim();
    } else {
      expected = rawExpected.trim();
    }

    testScenarios.push({
      name,
      text,
      expected,
      expectedErrors,
      expectedWarnings,
    });

    lastIndex = scenarioRegexResult.index + scenarioRegexResult[0].length;

    if (lastIndex == file.length) {
      break;
    }
  }

  return testScenarios;
}
