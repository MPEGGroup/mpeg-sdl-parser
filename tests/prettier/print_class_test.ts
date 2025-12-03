import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print Class tests", () => {
  test("prettified class output is as expected", async () => {
    await testPrettierScenario(
      "expandable(20) class odd(int a,B b) extends odder(a):bit(2) id= 2{}",
      "expandable(20) class odd(int a, B b) extends odder(a) : bit(2) id = 2 {\n" +
        "}\n",
      "expandable(20) class odd(int a, B b)\n" +
        "  extends odder(a) : bit(2) id = 2 {\n" +
        "}\n",
    );
  });
});
