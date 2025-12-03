import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print Do tests", () => {
  test("prettified do output is as expected", async () => {
    await testPrettierScenario(
      "class A{do { a[long_variable_name] = long_variable_name + 1; } while (another_long_variable_name > another_long_variable_name_2 + 1);}",
      "class A {\n" +
        "  do {\n" +
        "    a[long_variable_name] = long_variable_name + 1;\n" +
        "  } while (another_long_variable_name > another_long_variable_name_2 + 1);\n" +
        "}\n",
      "class A {\n" +
        "  do {\n" +
        "    a[long_variable_name] =\n" +
        "      long_variable_name +\n" +
        "      1;\n" +
        "  } while\n" +
        "    (another_long_variable_name >\n" +
        "    another_long_variable_name_2 +\n" +
        "    1);\n" +
        "}\n",
    );
  });
});
