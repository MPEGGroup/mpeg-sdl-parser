import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print Expression tests", () => {
  test("prettified expression output is as expected", async () => {
    await testPrettierScenario(
      "class A{N = 1 - data.adaptation_field_length_longer;}",
      "class A {\n" +
        "  N = 1 - data.adaptation_field_length_longer;\n" +
        "}\n",
      "class A {\n" +
        "  N = 1 -\n" +
        "    data.adaptation_field_length_longer;\n" +
        "}\n",
    );
  });
});
