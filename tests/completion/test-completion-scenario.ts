import { expect } from "bun:test";
import { createLenientSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../index.ts";
import { getExpectedTokenTypeIds } from "../../src/completion/get-expected-token-type-ids.ts";

const lenientSdlParser = createLenientSdlParser();

export function testCompletionScenario(
  source: string,
  expected: number[],
) {
  const sdlStringInput = new SdlStringInput(source);
  const parseTree = lenientSdlParser.parse(sdlStringInput);
  const cursor = parseTree.cursor();

  const actualTokenTypeIds: number[] = [];
  do {
    if (cursor.type.isError) {
      const tokenTypeIds = getExpectedTokenTypeIds(cursor);
      if (tokenTypeIds) {
        actualTokenTypeIds.push(...tokenTypeIds);
      } else {
        throw new Error("Expected token type IDs to be defined");
      }
    }
  } while (cursor.next());

  // sort and remove duplicates
  actualTokenTypeIds.sort((a, b) => a - b);
  const uniqueActualTokenTypeIds = Array.from(new Set(actualTokenTypeIds));

  expect(uniqueActualTokenTypeIds).toEqual(expected);
}
