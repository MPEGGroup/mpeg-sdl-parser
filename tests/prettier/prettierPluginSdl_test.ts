import * as prettier from "prettier";
import { promises as fs } from "node:fs";
import { type Buffer } from "node:buffer";
import path from "node:path";
import { describe, expect, test } from "bun:test";
import { prettierPluginSdl } from "../../src/prettier/prettierPluginSdl.ts";
import { createStrictSdlParser } from "../../src/lezer/createSdlParser.ts";
import { SdlStringInput } from "../../src/lezer/SdlStringInput.ts";

const strictSdlParser = createStrictSdlParser();

describe("Prettier Plugin SDL tests", () => {
  test("prettified output is as expected", async () => {
    const sampleSdlSpecification = await fs.readFile(
      path.join(__dirname, "../sample_specifications/various_elements.sdl"),
    ).then((buffer: Buffer) => buffer.toString());

    const options: prettier.Options = {
      parser: "sdl",
      plugins: [prettierPluginSdl],
    };

    const prettified = await prettier.format(sampleSdlSpecification, options);

    expect(prettified).toMatchSnapshot();
  });

  test("prettified output is valid", async () => {
    const sampleSdlSpecification = await fs.readFile(
      path.join(__dirname, "../sample_specifications/various_elements.sdl"),
    ).then((buffer: Buffer) => buffer.toString());

    const options: prettier.Options = {
      parser: "sdl",
      plugins: [prettierPluginSdl],
    };

    const prettified = await prettier.format(sampleSdlSpecification, options);

    const sdlStringInput = new SdlStringInput(prettified);
    strictSdlParser.parse(sdlStringInput);
  });
});
