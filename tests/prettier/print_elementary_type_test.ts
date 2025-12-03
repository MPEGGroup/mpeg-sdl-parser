import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print Elementary Type tests", () => {
  test("prettified elementary type output is as expected", async () => {
    await testPrettierScenario(
      "class A{aligned(16) bit(2) adaptation_field_control = 0x0000.0000;}",
      "class A {\n" +
        "  aligned(16) bit(2) adaptation_field_control = 0x0000.0000;\n" +
        "}\n",
      "class A {\n" +
        "  aligned(16) bit(2) adaptation_field_control =\n" +
        "    0x0000.0000;\n" +
        "}\n",
    );
  });

  test("prettified elementary type with embedded comments output is as expected", async () => {
    await testPrettierScenario(
      "class A{aligned(16) bit(2) // hello \nadaptation_field_control = 0x0000.0000;}",
      "class A {\n" +
        "  aligned(16) bit(2) // hello\n" +
        "    adaptation_field_control = 0x0000.0000;\n" +
        "}\n",
      "class A {\n" +
        "  aligned(16) bit(2) // hello\n" +
        "    adaptation_field_control = 0x0000.0000;\n" +
        "}\n",
    );
  });

  test("prettified computed elementary type output is as expected", async () => {
    await testPrettierScenario(
      "class A{computed unsigned int adaptation_field_control = 0x0000.0000;}",
      "class A {\n" +
        "  computed unsigned int adaptation_field_control = 0x0000.0000;\n" +
        "}\n",
      "class A {\n" +
        "  computed unsigned int\n" +
        "    adaptation_field_control =\n" +
        "    0x0000.0000;\n" +
        "}\n",
    );
  });

  test("prettified computed elementary type with embedded comments in nested indent output is as expected", async () => {
    await testPrettierScenario(
      "class A{if (i) computed unsigned int adaptation_field_control = // foo \n0x0000.0000;}",
      "class A {\n" +
        "  if (i)\n" +
        "    computed unsigned int adaptation_field_control = // foo\n" +
        "      0x0000.0000;\n" +
        "}\n",
      "class A {\n" +
        "  if (i)\n" +
        "    computed unsigned int\n" +
        "      adaptation_field_control = // foo\n" +
        "      0x0000.0000;\n" +
        "}\n",
    );
  });
});
