import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print If tests", () => {
  test("prettified if output is as expected", async () => {
    await testPrettierScenario(
      "class A{if (very_long_variable_name + another_long_variable_name > 0) { a[long_variable_name] = long_variable_name + 1; } else if (long_variable_name + another_long_variable_name > 0) { do_something++; } else { do_something_else++; }}",
      "class A {\n" +
        "  if (very_long_variable_name + another_long_variable_name > 0) {\n" +
        "    a[long_variable_name] = long_variable_name + 1;\n" +
        "  }\n" +
        "  else if (long_variable_name + another_long_variable_name > 0) {\n" +
        "    do_something++;\n" +
        "  }\n" +
        "  else {\n" +
        "    do_something_else++;\n" +
        "  }\n" +
        "}\n",
      "class A {\n" +
        "  if (very_long_variable_name +\n" +
        "    another_long_variable_name > 0) {\n" +
        "    a[long_variable_name] =\n" +
        "      long_variable_name +\n" +
        "      1;\n" +
        "  }\n" +
        "  else if (long_variable_name +\n" +
        "    another_long_variable_name > 0) {\n" +
        "    do_something++;\n" +
        "  }\n" +
        "  else {\n" +
        "    do_something_else++;\n" +
        "  }\n" +
        "}\n",
    );
  });
});
