import { describe, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";

describe("Print For tests", () => {
  test("prettified for output is as expected", async () => {
    await testPrettierScenario(
      "class A{for(computed int long_variable_name = 0;long_variable_name<2; long_variable_name++){another_long_variable_name = long_variable_name + 2;}}",
      "class A {\n" +
        "  for (computed int long_variable_name = 0; long_variable_name < 2; long_variable_name++) {\n" +
        "    another_long_variable_name = long_variable_name + 2;\n" +
        "  }\n" +
        "}\n",
      "class A {\n" +
        "  for (computed int long_variable_name =\n" +
        "    0; long_variable_name < 2; long_variable_name++) {\n" +
        "    another_long_variable_name =\n" +
        "      long_variable_name +\n" +
        "      2;\n" +
        "  }\n" +
        "}\n",
    );
  });
});
