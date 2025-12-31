import { describe, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";

describe("Print Error tests", () => {
  test("prettified error output is as expected 1", async () => {
    await testPrettierScenario(
      "class A {bit b;}",
      "class A {\n" +
        "  bit\n" +
        "  b;\n" +
        "}\n",
      "class A {\n" +
        "  bit\n" +
        "  b;\n" +
        "}\n",
    );
  });

  test("prettified error output is as expected 2", async () => {
    await testPrettierScenario(
      "class A {if (adaptation_ field_control == 0b01 || adaptation_field_control == 0b11) {}}",
      "class A {\n" +
        "  if (adaptation_\n" +
        "\n" +
        "  field_control == 0b01 || adaptation_field_control == 0b11)\n" +
        "  {\n" +
        "  }\n" +
        "}\n",
      "class A {\n" +
        "  if (adaptation_\n" +
        "\n" +
        "  field_control == 0b01 ||\n" +
        "    adaptation_field_control ==\n" +
        "    0b11)\n" +
        "  {\n" +
        "  }\n" +
        "}\n",
    );
  });
});
