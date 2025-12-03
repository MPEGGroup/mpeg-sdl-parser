import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print Array tests", () => {
  test("prettified array output is as expected", async () => {
    await testPrettierScenario(
      "class A{aligned(16) bit(2) adaptation_field_control[4][5];}",
      "class A {\n" +
        "  aligned(16) bit(2) adaptation_field_control[4][5];\n" +
        "}\n",
      "class A {\n" +
        "  aligned(16) bit(2)\n" +
        "    adaptation_field_control[4][5];\n" +
        "}\n",
    );
  });
});
