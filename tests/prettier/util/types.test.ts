import { doc } from "prettier";
import { describe, expect, test } from "bun:test";
import {
  isBreakParent,
  isFill,
  isHardline,
  isIndent,
  isLabel,
} from "../../../src/prettier/util/types.ts";

const { breakParent, hardline, label, line, indent, fill } = doc.builders;

describe("Type tests", () => {
  test("isBreakParent works", () => {
    expect(isBreakParent(breakParent)).toBe(true);
    expect(isHardline(line)).toBe(false);
  });

  test("isFill works", () => {
    expect(isFill(fill([line, "text", hardline]))).toBe(true);
    expect(isFill(line)).toBe(false);
  });

  test("isHardline works", () => {
    expect(isHardline(hardline)).toBe(true);
    expect(isHardline(line)).toBe(false);
  });

  test("isIndent works", () => {
    expect(isIndent(indent("indented"))).toBe(true);
    expect(isIndent(line)).toBe(false);
  });

  test("isLabel works", () => {
    expect(isLabel(label("my-label", "label"))).toBe(true);
    expect(isLabel(line)).toBe(false);
  });
});
