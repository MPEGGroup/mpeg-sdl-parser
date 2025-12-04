import { describe, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";

describe("Print Specification tests", () => {
  test("prettified specification output is as expected", async () => {
    await testPrettierScenario(
      "computed int i;computed int j;class A{i++;}class B{j++;}\n",
      "computed int i;\n" +
        "computed int j;\n" +
        "\n" +
        "class A {\n" +
        "  i++;\n" +
        "}\n" +
        "\n" +
        "class B {\n" +
        "  j++;\n" +
        "}\n",
      "computed int i;\n" +
        "computed int j;\n" +
        "\n" +
        "class A {\n" +
        "  i++;\n" +
        "}\n" +
        "\n" +
        "class B {\n" +
        "  j++;\n" +
        "}\n",
    );
  });

  test("prettified specification output is as expected for empty specification", async () => {
    await testPrettierScenario(
      "\n",
      "\n",
      "\n",
    );
  });

  test("prettified specification output is as expected for single invalid token", async () => {
    await testPrettierScenario(
      "§\n",
      "§\n",
      "§\n",
    );
  });
});
