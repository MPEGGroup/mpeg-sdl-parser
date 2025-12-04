import { describe, expect, test } from "bun:test";

import { createStrictSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";

const sdlParser = createStrictSdlParser();

describe("Invalid Syntax Tests", () => {
  test("Empty declarations parses", () => {
    const sdlStringInput = new SdlStringInput("");

    sdlParser.parse(sdlStringInput);
  });

  test("Declarations with single invalud token fails to parse", () => {
    const sdlStringInput = new SdlStringInput("§");

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 1, position: 0 }",
    );
  });

  test("No class parameter values in parenthesis fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d();}");

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Unexpected token fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD computed d;}");

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 17, position: 16 }",
    );
  });

  test("Trailing comma in class parameter values fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3,);}");

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Mix of concatenated string literal types fails to parse", () => {
    let sdlStringInput = new SdlStringInput(
      'class A {utf8string d = "hello" u"world";}',
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 25, position: 24 }",
    );

    sdlStringInput = new SdlStringInput(
      'class A {utf8string d = u"hello" "world";}',
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 34, position: 33 }",
    );
  });

  test("Both legacy and reserved together fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {reserved legacy utfstring foo;}",
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Invalid UTF string literal type fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {base64string foo = u"aGVsbG8K";}',
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 29, position: 28 }",
    );
  });

  test("Invalid basic string literal type fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string foo = "hello";}',
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 27, position: 26 }",
    );
  });

  test("Invalid prefix for string literal", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string foo = u8"hello";}',
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 28, position: 27 }",
    );
  });

  test("Illegal alignment bit count value fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {aligned(17) utf8string foo;}",
    );

    expect(() => sdlParser.parse(sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Parse error => { row: 1, column: 18, position: 17 }",
    );
  });
});
