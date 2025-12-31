import { describe, expect, test } from "bun:test";
import type { Text } from "@codemirror/state";
import { SyntacticParseError } from "../../src/parse-error.ts";
import { createParseErrorFromTextAndPosition } from "../../src/lezer/create-parse-error-from-text-and-position.ts";

// Minimal mock for @codemirror/state Text
class MockText {
  private _lines: string[];
  constructor(text: string) {
    this._lines = text.split("\n");
  }
  get lines(): number {
    return this._lines.length;
  }
  lineAt(pos: number) {
    let total = 0;
    for (let i = 0; i < this._lines.length; i++) {
      const lineLen = this._lines[i].length + 1; // +1 for '\n'
      if (pos < total + lineLen) {
        return {
          number: i + 1,
          from: total,
          to: total + this._lines[i].length,
          text: this._lines[i],
          length: this._lines[i].length,
        };
      }
      total += lineLen;
    }
    // fallback to last line
    const last = this._lines.length - 1;
    return {
      number: this._lines.length,
      from: total - (this._lines[last].length + 1),
      to: total,
      text: this._lines[last],
      length: this._lines[last].length,
    };
  }
  line(n: number) {
    // Line numbers in Text interface are 1-indexed, array is 0-indexed
    const index = n - 1;
    if (index < 0 || index >= this._lines.length) {
      throw new Error(`Line ${n} is out of range (1-${this._lines.length})`);
    }
    return {
      number: n,
      from: this.getLineStart(n),
      to: this.getLineStart(n) + this._lines[index].length,
      text: this._lines[index],
      length: this._lines[index].length,
    };
  }
  getLineStart(n: number) {
    let pos = 0;
    for (let i = 0; i < n - 1; i++) {
      pos += this._lines[i].length + 1;
    }
    return pos;
  }
}

describe("createParseErrorFromTextAndPosition Tests", () => {
  test("creates a SyntacticParseError with correct location and errorLine", () => {
    const text = new MockText("foo\nbar\nbaz");
    // Position 5 is in line 2 ("bar"), column 1
    const err = createParseErrorFromTextAndPosition(
      text as unknown as Text,
      4,
    );

    expect(err).toBeInstanceOf(SyntacticParseError);
    expect(err.location).toEqual({ row: 2, column: 1, position: 4 });
    expect(err.errorLine).toBe("bar");
    expect(err.preceedingLines).toEqual(["foo"]);
    expect(err.message).toContain("Parse error");
  });

  test("creates a SyntacticParseError handling position at start of text", () => {
    const text = new MockText("abc\ndef");
    const err = createParseErrorFromTextAndPosition(
      text as unknown as Text,
      0,
    );

    expect(err.location).toEqual({ row: 1, column: 1, position: 0 });
    expect(err.errorLine).toBe("abc");
    expect(err.preceedingLines).toEqual([]);
  });

  test("creates a SyntacticParseError handling position at start of a later line", () => {
    const text = new MockText("abc\ndef\nghi");
    // Position 4 is start of line 2 ("def")
    const err = createParseErrorFromTextAndPosition(
      text as unknown as Text,
      4,
    );

    expect(err.location).toEqual({ row: 2, column: 1, position: 4 });
    expect(err.errorLine).toBe("def");
    expect(err.preceedingLines).toEqual(["abc"]);
  });

  test("creates a SyntacticParseError including up to two preceding lines", () => {
    const text = new MockText("a\nb\nc\nd");
    // Position 6 is in line 4 ("d")
    const err = createParseErrorFromTextAndPosition(
      text as unknown as Text,
      6,
    );

    expect(err.location?.row).toBe(4);
    expect(err.errorLine).toBe("d");
    expect(err.preceedingLines).toEqual(["b", "c"]);
  });

  test("creates a SyntacticParseError handling position at last line", () => {
    const text = new MockText("x\ny\nz");
    // Position 4 is in line 3 ("z")
    const err = createParseErrorFromTextAndPosition(
      text as unknown as Text,
      4,
    );

    expect(err.location?.row).toBe(3);
    expect(err.errorLine).toBe("z");
    expect(err.preceedingLines).toEqual(["x", "y"]);
  });
});
