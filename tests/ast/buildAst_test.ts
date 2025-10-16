import { describe, expect, test } from "bun:test";
import { buildAst } from "../../src/ast/buildAst.ts";
import {
  createLenientSdlParser,
  createStrictSdlParser,
} from "../../src/lezer/createSdlParser.ts";
import { SdlStringInput } from "../../src/lezer/SdlStringInput.ts";
import { Specification } from "../../src/ast/node/Specification.ts";
import { ClassDeclaration } from "../../src/ast/node/ClassDeclaration.ts";
import { Identifier } from "../../src/ast/node/Identifier.ts";

const lenientSdlParser = createLenientSdlParser();
const strictSdlParser = createStrictSdlParser();

describe("buildAst Tests", () => {
  test("Parse tree with parse errors causes SyntacticParseError", () => {
    const sdlStringInput = new SdlStringInput("int i;");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    expect(() => buildAst(parseTree, sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Missing expected token: computed => { row: 1, column: 1, position: 0 }",
    );
  });

  test("buildAst - simple", () => {
    const sdlStringInput = new SdlStringInput("class A {}");
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    expect(
      specification,
    ).toEqual(
      new Specification(
        [
          new ClassDeclaration(
            undefined,
            undefined,
            false,
            new Identifier(
              "A",
              {
                text: "A",
                location: { row: 1, column: 7, position: 6 },
                leadingTrivia: [],
                trailingTrivia: [],
              },
            ),
            undefined,
            undefined,
            undefined,
            [],
            undefined,
            {
              text: "class",
              location: { row: 1, column: 1, position: 0 },
              leadingTrivia: [],
              trailingTrivia: [],
            },
            {
              text: "{",
              location: { row: 1, column: 9, position: 8 },
              leadingTrivia: [],
              trailingTrivia: [],
            },
            {
              text: "}",
              location: { row: 1, column: 10, position: 9 },
              leadingTrivia: [],
              trailingTrivia: [],
            },
          ),
        ],
      ),
    );
  });

  test("buildAst - JSON", () => {
    const sdlStringInput = new SdlStringInput("computed int i;");
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);
    const actual = JSON.stringify(specification);
    const expected =
      '{"nodeKind":21,"startToken":{"text":"computed","location":{"row":1,"column":1,"position":0},"leadingTrivia":[],"trailingTrivia":[]},"endToken":{"text":";","location":{"row":1,"column":15,"position":14},"leadingTrivia":[],"trailingTrivia":[]},"isComposite":true,"globals":[{"nodeKind":22,"startToken":{"text":"computed","location":{"row":1,"column":1,"position":0},"leadingTrivia":[],"trailingTrivia":[]},"endToken":{"text":";","location":{"row":1,"column":15,"position":14},"leadingTrivia":[],"trailingTrivia":[]},"isComposite":true,"statementKind":2,"isConst":false,"elementaryType":{"nodeKind":9,"startToken":{"text":"int","location":{"row":1,"column":10,"position":9},"leadingTrivia":[],"trailingTrivia":[]},"endToken":{"text":"int","location":{"row":1,"column":10,"position":9},"leadingTrivia":[],"trailingTrivia":[]},"isComposite":false,"elementaryTypeKind":0,"typeKeyword":{"text":"int","location":{"row":1,"column":10,"position":9},"leadingTrivia":[],"trailingTrivia":[]}},"identifier":{"nodeKind":14,"startToken":{"text":"i","location":{"row":1,"column":14,"position":13},"leadingTrivia":[],"trailingTrivia":[]},"endToken":{"text":"i","location":{"row":1,"column":14,"position":13},"leadingTrivia":[],"trailingTrivia":[]},"isComposite":false,"name":"i","literal":{"text":"i","location":{"row":1,"column":14,"position":13},"leadingTrivia":[],"trailingTrivia":[]}},"semicolonPunctuator":{"text":";","location":{"row":1,"column":15,"position":14},"leadingTrivia":[],"trailingTrivia":[]},"computedKeyword":{"text":"computed","location":{"row":1,"column":1,"position":0},"leadingTrivia":[],"trailingTrivia":[]}}]}';

    expect(actual).toEqual(expected);
  });
});
