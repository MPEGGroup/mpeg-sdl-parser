import { describe, test } from "bun:test";
import { testPotentialSyntacticTokensScenario } from "./test-potential-syntactic-tokens-scenario.ts";

describe("getPotentialSyntacticTokens Tests", () => {
  test("Test missing length attribute potential syntactic token scenario", () => {
    testPotentialSyntacticTokensScenario(
      "class A { bit b; }",
      14,
      ["("],
    );
  });

  test("Test duplicate identifier potential syntactic token scenario", () => {
    testPotentialSyntacticTokensScenario(
      "class A {if (f oo) {bit(8) c;}}",
      15,
      [
        "!=",
        "%",
        "&",
        "&&",
        "*",
        "+",
        "-",
        "/",
        "<",
        "<<",
        "<=",
        "==",
        ">",
        ">=",
        ">>",
        "|",
        "||",
      ].sort(),
    );
  });

  test("Test complex potential syntactic token scenario", () => {
    testPotentialSyntacticTokensScenario(
      "class A {if (a b == 0b01 || c == 0b11) {bit(8) c;}}",
      15,
      [
        "!=",
        "%",
        "&",
        "&&",
        ")",
        "*",
        "+",
        "-",
        "/",
        "<",
        "<<",
        "<=",
        "==",
        ">",
        ">=",
        ">>",
        "|",
        "||",
      ].sort(),
    );
  });

  test("Test global scope potential syntactic token scenario", () => {
    testPotentialSyntacticTokensScenario(
      "",
      0,
      ["abstract", "aligned", "class", "computed", "expandable", "map"].sort(),
    );
  });

  test("Test global scope with previous comment potential syntactic token scenario 1", () => {
    testPotentialSyntacticTokensScenario(
      "// foo",
      6,
      undefined,
    );
  });

  test("Test global scope with previous comment potential syntactic token scenario 2", () => {
    testPotentialSyntacticTokensScenario(
      "// foo\n ",
      8,
      ["abstract", "aligned", "class", "computed", "expandable", "map"].sort(),
    );
  });
});
