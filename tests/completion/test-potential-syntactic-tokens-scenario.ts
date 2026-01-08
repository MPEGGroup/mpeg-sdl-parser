import { expect } from "bun:test";
import { createLenientSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../index.ts";
import { getPotentialSyntacticTokens } from "../../src/completion/get-potential-syntactic-tokens.ts";

const lenientSdlParser = createLenientSdlParser();

export function testPotentialSyntacticTokensScenario(
  source: string,
  position: number,
  expectedSyntacticTokens: string[],
) {
  const sdlStringInput = new SdlStringInput(source);
  const parseTree = lenientSdlParser.parse(sdlStringInput);
  const lastNode = parseTree.resolveInner(position, -1);

  const actualSyntacticTokens = getPotentialSyntacticTokens(lastNode.cursor());

  if (!actualSyntacticTokens) {
    throw new Error("Expected syntactic tokens to be defined");
  }

  expect(actualSyntacticTokens).toEqual(expectedSyntacticTokens);
}
