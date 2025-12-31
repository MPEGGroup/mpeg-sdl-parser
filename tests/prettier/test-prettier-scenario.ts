import * as prettier from "prettier";
import { expect } from "bun:test";
import { prettierPluginSdl } from "../../src/prettier/prettier-plugin-sdl.ts";
import { createLenientSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../index.ts";

const lenientSdlParser = createLenientSdlParser();

export async function testPrettierScenario(
  source: string,
  expected: string,
  expectedNarrow: string,
) {
  const options: prettier.Options = {
    parser: "sdl",
    plugins: [prettierPluginSdl],
    // test wide
    printWidth: 160,
  };

  let prettified = await prettier.format(source, options);

  expect(prettified).toEqual(expected);

  // check that the prettified output is valid SDL
  let sdlStringInput = new SdlStringInput(prettified);

  lenientSdlParser.parse(sdlStringInput);

  // test narrow
  options.printWidth = 40;

  prettified = await prettier.format(source, options);

  expect(prettified).toEqual(expectedNarrow);

  // check that the prettified output is valid SDL
  sdlStringInput = new SdlStringInput(prettified);

  lenientSdlParser.parse(sdlStringInput);
}
