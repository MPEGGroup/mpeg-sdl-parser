import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print While tests", () => {
  test("prettified while output is as expected", async () => {
    await testPrettierScenario(
      "class A{while (very_long_variable_name + another_long_variable_name > 0) { a[long_variable_name] = long_variable_name + 1; }}",
      "class A {\n" +
        "  while (very_long_variable_name + another_long_variable_name > 0) {\n" +
        "    a[long_variable_name] = long_variable_name + 1;\n" +
        "  }\n" +
        "}\n",
      "class A {\n" +
        "  while (very_long_variable_name +\n" +
        "    another_long_variable_name > 0) {\n" +
        "    a[long_variable_name] =\n" +
        "      long_variable_name +\n" +
        "      1;\n" +
        "  }\n" +
        "}\n",
    );
  });
});
