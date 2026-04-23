import { describe, expect, test } from "bun:test";
import {
  createLenientSdlAnalyser,
  createStrictSdlAnalyser,
} from "../../src/analyser/create-sdl-analyser.ts";
import { createLenientSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";
import { buildAst } from "../../src/ast/build-ast.ts";
import type { Specification } from "../../src/ast/node/specification.ts";

const lenientSdlParser = createLenientSdlParser();

function buildAstWithErrors() {
  const sdlStringInput = new SdlStringInput(
    "class A{bit transport_priority;}",
  );
  const parseTree = lenientSdlParser.parse(sdlStringInput);
  const specification = buildAst(
    parseTree,
    sdlStringInput,
    true,
  );

  return specification;
}

describe("createSdlAnalyser Tests", () => {
  test("Test lenient SDL analyser creation", () => {
    createLenientSdlAnalyser();
  });

  test("Test strict SDL analyser creation", () => {
    createStrictSdlAnalyser();
  });

  test("Test lenient SDL analyser handles syntactic errors in parse tree", () => {
    const specificationWithErrors = buildAstWithErrors();
    const sdlAnalyser = createLenientSdlAnalyser();

    // The lenient analyser should not throw an error
    sdlAnalyser.analyse(specificationWithErrors as Specification);
  });

  test("Test strict SDL analyser throws on syntactic errors in parse tree", () => {
    const specificationWithErrors = buildAstWithErrors();

    const sdlAnalyser = createStrictSdlAnalyser();

    expect(() => sdlAnalyser.analyse(specificationWithErrors as Specification))
      .toThrow(
        "SEMANTIC ERROR: Required identifier property is a Token node: ERROR_MISSING_TOKEN",
      );
  });
});
