import { describe, expect, test } from "bun:test";
import { createLenientSdlParser } from "../../src/lezer/createSdlParser.ts";
import { SdlStringInput } from "../../src/lezer/SdlStringInput.ts";
import { getExpectedTokenTypes } from "../../src/completion/getExpectedTokenTypes.ts";

const lenientSdlParser = createLenientSdlParser();

describe("getExpectedTokenTypes Tests", () => {
  test("Test missing length attribute", () => {
    const sdlStringInput = new SdlStringInput("class A { bit b; }");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const cursor = parseTree.cursor();
    do {
      if (cursor.type.isError) {
        break;
      }
    } while (cursor.next());

    const tokenTypes = getExpectedTokenTypes(cursor);

    expect(tokenTypes!.map((type) => type.name)).toEqual(["LengthAttribute"]);
  });

  test("Test duplicate identifier", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {if (f oo) {bit(8) c;}}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const cursor = parseTree.cursor();
    do {
      if (cursor.type.isError) {
        break;
      }
    } while (cursor.next());

    const tokenTypes = getExpectedTokenTypes(cursor);

    expect(tokenTypes!.map((type) => type.name)).toEqual([
      "Multiplication",
      "Division",
      "Modulus",
      "Addition",
      "Subtraction",
      "BitwiseShiftLeft",
      "BitwiseShiftRight",
      "RelationalLessThan",
      "RelationalLessThanOrEqual",
      "RelationalGreaterThan",
      "RelationalGreaterThanOrEqual",
      "RelationalEqual",
      "RelationalNotEqual",
      "BitwiseAnd",
      "BitwiseOr",
      "LogicalAnd",
      "LogicalOr",
    ]);
  });
});
