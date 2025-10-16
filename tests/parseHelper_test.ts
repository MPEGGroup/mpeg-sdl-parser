import { describe, expect, test } from "bun:test";
import { type Buffer } from "node:buffer";
import path from "node:path";
import { promises as fs } from "node:fs";
import HistoryRecordingNodeHandler, {
  expectedHistory,
} from "./fixtures/HistoryRecordingNodeHandler.ts";
import { buildAst } from "../src/ast/buildAst.ts";
import {
  createLenientSdlParser,
  createStrictSdlParser,
} from "../src/lezer/createSdlParser.ts";
import {
  collateParseErrors,
  dispatchNodeHandler,
  prettyPrint,
} from "../src/parseHelper.ts";
import { SdlStringInput } from "../src/lezer/SdlStringInput.ts";

const strictSdlParser = createStrictSdlParser();
const lenientSdlParser = createLenientSdlParser();

describe("Parse Helper Tests", () => {
  test("Test collateParseErrors", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample_specifications/invalid.sdl"),
    ).then((buffer: Buffer) => buffer.toString());

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors).toHaveLength(3);
    expect(parseErrors[0].errorLine).toEqual(
      "  bit           transport_priority;",
    );
    expect(parseErrors[1].errorLine).toEqual("  unsigned int N = 184;");
    expect(parseErrors[2].errorLine).toEqual(
      "  if (adaptation_ field_control == 0b01 || adaptation_field_control == 0b11) {",
    );
    expect(parseErrors[0].location!.column).toEqual(17);
    expect(parseErrors[1].location!.column).toEqual(16);
    expect(parseErrors[2].location!.column).toEqual(19);
  });

  test("Test collateParseErrors - no class parameter values in parenthesis fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d();}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: <UnaryExpression> or <BinaryExpression> => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Test collateParseErrors - unexpected token fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD computed d;}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Unexpected token: computed => { row: 1, column: 17, position: 16 }",
    );
  });

  test("Test collateParseErrors - trailing comma in class parameter values fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3,);}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: <UnaryExpression> or <BinaryExpression> => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Test collateParseErrors - unterminated class parameter values ending in expression fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3;}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: , or ) => { row: 1, column: 20, position: 19 }",
    );
  });

  test("Test collateParseErrors - unterminated class parameter values ending in comma fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {ClassD d(3,;}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: <UnaryExpression> or <BinaryExpression> => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Test collateParseErrors - unterminated string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string d = u";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      'SYNTACTIC ERROR: Missing expected token: " => { row: 1, column: 29, position: 28 }',
    );
  });

  test("Test collateParseErrors - missing utf string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {utf8string d = ;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: u => { row: 1, column: 25, position: 24 }",
    );
  });

  test("Test collateParseErrors - missing string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {base64string d = ;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      'SYNTACTIC ERROR: Missing expected token: " => { row: 1, column: 27, position: 26 }',
    );
  });

  test("Test collateParseErrors - mix of concatenated string literal types fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string d = u"hello" "world";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: u => { row: 1, column: 34, position: 33 }",
    );
  });

  test("Test collateParseErrors - both legacy and reserved together fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {reserved legacy utfstring foo;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: const or <AlignedModifier> or utf8string or utf16string or utfstring or base64string => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Test collateParseErrors - unexpected prefix for string literal", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {base64string foo = u"aGVsbG8K";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Unexpected token: u <Identifier> => { row: 1, column: 29, position: 28 }",
    );
  });

  test("Test collateParseErrors - invalid basic string literal type fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string foo = "hello";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: u => { row: 1, column: 27, position: 26 }",
    );
  });

  test("Test collateParseErrors - invalid prefix for string literal", () => {
    const sdlStringInput = new SdlStringInput(
      'class A {utf8string foo = u8"hello";}',
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Unexpected token: 8 <IntegerLiteral> => { row: 1, column: 28, position: 27 }",
    );
  });

  test("Test collateParseErrors - illegal alignment bit count value fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {aligned(17) utf8string foo;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: 8 or 16 or 32 or 64 or 128 => { row: 1, column: 18, position: 17 }",
    );
  });

  test("Test collateParseErrors - unterminated alignment modifier fails to parse", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {aligned(16 utf8string foo;}",
    );
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: ) => { row: 1, column: 21, position: 20 }",
    );
  });

  test("Test collateParseErrors - while loop fails to parse", () => {
    const sdlStringInput = new SdlStringInput("class A {while (1)}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: <CompoundStatement> => { row: 1, column: 19, position: 18 }",
    );
  });

  test("Test collateParseErrors - empty specification", () => {
    const sdlStringInput = new SdlStringInput("");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const parseErrors = collateParseErrors(parseTree, sdlStringInput);

    expect(parseErrors[0].message).toBe(
      "SYNTACTIC ERROR: Missing expected token: <ClassDeclaration> or <MapDeclaration> or <ComputedElementaryTypeDefinition> => { row: 1, column: 1, position: 0 }",
    );
  });

  test("Test prettyPrint", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample_specifications/various_elements.sdl"),
    ).then((buffer: Buffer) => buffer.toString());
    let expectedSdlString = await fs.readFile(
      path.join(
        __dirname,
        "./sample_specifications/prettified_various_elements.sdl",
      ),
    ).then((buffer: Buffer) => buffer.toString());
    expectedSdlString = expectedSdlString.replace(/\r/g, "");

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    const prettifiedSdlString = await prettyPrint(
      specification,
      sdlStringInput,
    );

    expect(
      prettifiedSdlString,
    ).toEqual(
      expectedSdlString,
    );
  });

  test("Test dispatchNodeHandler", async () => {
    const sdlString = await fs.readFile(
      path.join(__dirname, "./sample_specifications/sample.sdl"),
    ).then((buffer: Buffer) => buffer.toString());

    const sdlStringInput = new SdlStringInput(sdlString);
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    const historyRecordingNodeHandler = new HistoryRecordingNodeHandler();

    dispatchNodeHandler(specification, historyRecordingNodeHandler);

    expect(
      historyRecordingNodeHandler.nodeHistory,
    ).toEqual(
      expectedHistory,
    );
  });
});
