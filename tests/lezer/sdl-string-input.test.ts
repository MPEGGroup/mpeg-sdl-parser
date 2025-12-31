import { describe, expect, test } from "bun:test";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";

describe("SdlStringInput Tests", () => {
  test("Test creation and basic behavior", () => {
    const input = new SdlStringInput("test 1\ntest 2\n");
    expect(input.length).toBe(14);
    expect(input.chunk(0)).toBe("test 1\ntest 2\n");
    expect(input.read(0, 5)).toBe("test ");
    expect(input.read(5, 12)).toBe("1\ntest ");
  });
});
