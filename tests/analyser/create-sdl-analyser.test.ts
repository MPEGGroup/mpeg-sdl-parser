import { describe, test } from "bun:test";
import {
  createLenientSdlAnalyser,
  createStrictSdlAnalyser,
} from "../../src/analyser/create-sdl-analyser.ts";

describe("createSdlAnalyser Tests", () => {
  test("Test lenient SDL analyser creation", () => {
    createLenientSdlAnalyser();
  });

  test("Test strict SDL analyser creation", () => {
    createStrictSdlAnalyser();
  });
});
