import { describe, expect, test } from "bun:test";

import { Specification } from "../../src/ast/node/specification.ts";
import { createStrictSdlAnalyser } from "../../src/analyser/create-sdl-analyser.ts";
import { createStrictSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";
import { buildAst } from "../../src/ast/build-ast.ts";

const sdlParser = createStrictSdlParser();
const sdlAnalyser = createStrictSdlAnalyser();

describe("Semantic Error Scenario Tests", () => {
  test("Empty specification ok", () => {
    const specification = new Specification([]);

    sdlAnalyser.analyse(specification);
  });

  test("Duplicate global symbol", () => {
    const sdlStringInput = new SdlStringInput(
      "computed int a = 1; computed int a = 2;",
    );
    const parseTree = sdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    expect(() => sdlAnalyser.analyse(specification as Specification)).toThrow(
      "SEMANTIC ERROR: Variable: 'a' is already declared in scope: global => { row: 1, column: 34, position: 33 }",
    );
  });

  test("Undefined symbol", () => {
    const sdlStringInput = new SdlStringInput("class A { B b;}");
    const parseTree = sdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    expect(() => sdlAnalyser.analyse(specification as Specification)).toThrow(
      "SEMANTIC ERROR: Class 'B' is not declared => { row: 1, column: 11, position: 10 }",
    );
  });
});
