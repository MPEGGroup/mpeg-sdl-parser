import { describe, expect, test } from "bun:test";
import { type Buffer } from "node:buffer";
import path from "node:path";
import { promises as fs } from "node:fs";
import HistoryRecordingNodeHandler, {
  expectedHistory,
} from "./fixtures/history-recording-node-handler.ts";
import { buildAst } from "../src/ast/build-ast.ts";
import {
  createLenientSdlParser,
  createStrictSdlParser,
} from "../src/lezer/create-sdl-parser.ts";
import {
  collateSyntaxErrors,
  dispatchNodeHandler,
  prettyPrint,
} from "../src/parse-helper.ts";
import { SdlStringInput } from "../src/lezer/sdl-string-input.ts";
import type { Specification } from "../src/ast/node/specification.ts";

const strictSdlParser = createStrictSdlParser();
const lenientSdlParser = createLenientSdlParser();

describe("Parse Helper Tests", () => {
  test("Test collateSyntaxErrors - invalid sample specification", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample-specifications/invalid.sdl"),
    ).then((buffer: Buffer) => buffer.toString());

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors).toHaveLength(5);
    expect(syntaxErrors[0].errorLine).toEqual(
      "  bit           transport_priority;",
    );
    expect(syntaxErrors[1].errorLine).toEqual("  unsigned int N = 184;");
    expect(syntaxErrors[2].errorLine).toEqual(
      "  if (adaptation_ field_control == 0b01 || adaptation_field_control == 0b11) {",
    );
    expect(syntaxErrors[0].location!.column).toEqual(17);
    expect(syntaxErrors[1].location!.column).toEqual(16);
    expect(syntaxErrors[2].location!.column).toEqual(19);
  });

  test("Test collateSyntaxErrors - invalid elementary type definition", () => {
    const sdlStringInput = new SdlStringInput(
      "class A{bit transport_priority;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: <LengthAttribute> => { row: 1, column: 13, position: 12 }",
    );
  });

  test("Test collateSyntaxErrors - no class parameter values in parenthesis fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d();}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected one of: - ( + <BinaryLiteral> <DecimalLiteral> <FloatingPointLiteral> <HexadecimalLiteral> <Identifier> <IntegerLiteral> <LengthofExpression> <MultipleCharacterLiteral> => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Test collateSyntaxErrors - unexpected token fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD computed d;}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Unexpected: computed => { row: 1, column: 17, position: 16 }",
    );
  });

  test("Test collateSyntaxErrors - trailing comma in class parameter values fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3,);}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected one of: <BinaryExpression> <UnaryExpression> => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Test collateSyntaxErrors - unterminated class parameter values ending in expression fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3;}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected one of: - , != ) * / & && % + < << <= == > >= >> | || => { row: 1, column: 20, position: 19 }",
    );
  });

  test("Test collateSyntaxErrors - unterminated class parameter values ending in comma fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3,;}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected one of: <BinaryExpression> <UnaryExpression> => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Test collateSyntaxErrors - unterminated string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string d = u";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      'SYNTAX ERROR: Expected: " => { row: 1, column: 29, position: 28 }',
    );
  });

  test("Test collateSyntaxErrors - missing utf string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {utf8string d = ;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: <UtfStringLiteral> => { row: 1, column: 25, position: 24 }",
    );
  });

  test("Test collateSyntaxErrors - missing string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {base64string d = ;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: <Base64StringLiteral> => { row: 1, column: 27, position: 26 }",
    );
  });

  test("Test collateSyntaxErrors - mix of concatenated string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string d = u"hello" "world";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: u => { row: 1, column: 34, position: 33 }",
    );
  });

  test("Test collateSyntaxErrors - both legacy and reserved together fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {reserved legacy utfstring foo;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected one of: base64string const utf16string utf8string utfstring <AlignedModifier> => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Test collateSyntaxErrors - unexpected prefix for string literal", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {base64string foo = u"aGVsbG8K";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Unexpected: u => { row: 1, column: 29, position: 28 }",
    );
  });

  test("Test collateSyntaxErrors - invalid basic string literal type fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string foo = "hello";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: u => { row: 1, column: 27, position: 26 }",
    );
  });

  test("Test collateSyntaxErrors - invalid prefix for string literal", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string foo = u8"hello";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Unexpected: 8 => { row: 1, column: 28, position: 27 }",
    );
  });

  test("Test collateSyntaxErrors - illegal alignment bit count value fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {aligned(17) utf8string foo;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected one of: 8 16 32 64 128 => { row: 1, column: 18, position: 17 }",
    );
  });

  test("Test collateSyntaxErrors - unterminated alignment modifier fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {aligned(16 utf8string foo;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: ) => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Test collateSyntaxErrors - while loop fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {while (1)}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Expected: <CompoundStatement> => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Test collateSyntaxErrors - empty specification produces no errors", () => {
    const sdlStringInput = new SdlStringInput("");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors.length).toBe(0);
  });

  test("Test collateSyntaxErrors - single invalid token produces error", () => {
    const sdlStringInput = new SdlStringInput("§");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const syntaxErrors = collateSyntaxErrors(parseTree, sdlStringInput);

    expect(syntaxErrors[0].message).toBe(
      "SYNTAX ERROR: Unknown token: § => { row: 1, column: 1, position: 0 }",
    );
  });

  test("Test prettyPrint", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample-specifications/various-elements.sdl"),
    ).then((buffer: Buffer) => buffer.toString());
    let expectedSdlString = await fs.readFile(
      path.join(
        __dirname,
        "./sample-specifications/prettified-various-elements.sdl",
      ),
    ).then((buffer: Buffer) => buffer.toString());
    expectedSdlString = expectedSdlString.replace(/\r/g, "");

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    const prettifiedSdlString = await prettyPrint(
      specification as Specification,
      sdlStringInput,
    );
    expect(
      prettifiedSdlString,
    ).toEqual(
      expectedSdlString,
    );
  });

  test("Test prettyPrint - narrower", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample-specifications/various-elements.sdl"),
    ).then((buffer: Buffer) => buffer.toString());
    let expectedSdlString = await fs.readFile(
      path.join(
        __dirname,
        "./sample-specifications/prettified-various-elements-narrow.sdl",
      ),
    ).then((buffer: Buffer) => buffer.toString());
    expectedSdlString = expectedSdlString.replace(/\r/g, "");

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    const narrowPrettifiedSdlString = await prettyPrint(
      specification as Specification,
      sdlStringInput,
      40,
    );
    expect(
      narrowPrettifiedSdlString,
    ).toEqual(
      expectedSdlString,
    );
  });

  test("Test prettyPrint - with syntax errors", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample-specifications/invalid.sdl"),
    ).then((buffer: Buffer) => buffer.toString());
    let expectedSdlString = await fs.readFile(
      path.join(
        __dirname,
        "./sample-specifications/prettified-invalid.sdl",
      ),
    ).then((buffer: Buffer) => buffer.toString());
    expectedSdlString = expectedSdlString.replace(/\r/g, "");

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput, true);

    const invalidPrettifiedSdlString = await prettyPrint(
      specification as Specification,
      sdlStringInput,
    );
    expect(
      invalidPrettifiedSdlString,
    ).toEqual(
      expectedSdlString,
    );
  });

  test("Test dispatchNodeHandler", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample-specifications/sample.sdl"),
    ).then((buffer: Buffer) => buffer.toString());

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    const historyRecordingNodeHandler = new HistoryRecordingNodeHandler();

    dispatchNodeHandler(
      specification as Specification,
      historyRecordingNodeHandler,
    );

    expect(
      historyRecordingNodeHandler.nodeHistory,
    ).toEqual(
      expectedHistory,
    );
  });
});
