import { describe, expect, test } from "bun:test";
import path from "node:path";
import { type Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import HistoryRecordingNodeHandler, {
  expectedHistory,
} from "../../fixtures/history-recording-node-handler.ts";
import { createStrictSdlParser } from "../../../src/lezer/create-sdl-parser.ts";
import { TraversingVisitor } from "../../../src/ast/visitor/traversing-visitor.ts";
import { SdlStringInput } from "../../../src/lezer/sdl-string-input.ts";
import { buildAst } from "../../../src/ast/build-ast.ts";

describe("TraversingVisitor Tests", () => {
  test("Test traversing visitor", async () => {
    const sdlSource = await fs.readFile(
      path.join(__dirname, "../../sample-specifications/sample.sdl"),
    ).then((buffer: Buffer) => buffer.toString());
    const sdlStringInput = new SdlStringInput(sdlSource);
    const sdlParser = createStrictSdlParser();
    const sdlParseTree = sdlParser.parse(sdlStringInput);
    const specification = buildAst(sdlParseTree, sdlStringInput);

    const historyRecordingNodeHandler = new HistoryRecordingNodeHandler();
    const traversingVisitor = new TraversingVisitor(
      historyRecordingNodeHandler,
    );

    traversingVisitor.visit(specification);

    expect(
      historyRecordingNodeHandler.nodeHistory,
    ).toEqual(
      expectedHistory,
    );
  });
});
