import { describe, test } from "bun:test";

import { Specification } from "../../src/ast/node/specification.ts";
import { createStrictSdlAnalyser } from "../../src/analyser/create-sdl-analyser.ts";

const sdlAnalyser = createStrictSdlAnalyser();

describe("Semantic Error Scenario Tests", () => {
  test("Empty specification ok", () => {
    const specification = new Specification([]);

    sdlAnalyser.analyse(specification);
  });

  // test("Declarations with single invalid token fails to parse", () => {
  //   const sdlStringInput = new SdlStringInput("§");

  //   expect(() => sdlParser.parse(sdlStringInput)).toThrow(
  //     "SYNTAX ERROR: => { row: 1, column: 1, position: 0 }",
  //   );
  // });
});
