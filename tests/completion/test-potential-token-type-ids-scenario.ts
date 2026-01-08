import { expect } from "bun:test";
import { createLenientSdlParser } from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../index.ts";
import { getPotentialTokenTypeIds } from "../../src/completion/get-potential-token-type-ids.ts";

const lenientSdlParser = createLenientSdlParser();

export function testPotentialTokenTypeIdsScenario(
  source: string,
  expectedTokenTypeIds: number[],
) {
  const sdlStringInput = new SdlStringInput(source);
  const parseTree = lenientSdlParser.parse(sdlStringInput);
  const cursor = parseTree.cursor();

  do {
    if (cursor.type.isError) {
      break;
    }
  } while (cursor.next());

  const actualTokenTypeIds = getPotentialTokenTypeIds(cursor);

  if (!actualTokenTypeIds) {
    throw new Error("Expected token type IDs to be defined");
  }

  // sort and remove duplicates as we have potentially collected from multiple error nodes
  actualTokenTypeIds.sort((a, b) => a - b);
  const uniqueActualTokenTypeIds = Array.from(new Set(actualTokenTypeIds));

  expect(uniqueActualTokenTypeIds).toEqual(expectedTokenTypeIds);
}
