import { describe, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";

describe("Print Number Literal tests", () => {
  test("prettified binary number literal is as expected", async () => {
    await testPrettierScenario(
      "class A{bit(8)b=0b1101.1101;}\n",
      "class A {\n" +
        "  bit(8) b = 0b1101.1101;\n" +
        "}\n",
      "class A {\n" +
        "  bit(8) b = 0b1101.1101;\n" +
        "}\n",
    );
  });

  test("prettified multi-character number literal is as expected", async () => {
    await testPrettierScenario(
      "class A{bit(8)b='abcd''efgh';}\n",
      "class A {\n" +
        "  bit(8) b = 'abcd' 'efgh';\n" +
        "}\n",
      "class A {\n" +
        "  bit(8) b = 'abcd' 'efgh';\n" +
        "}\n",
    );
  });
});
