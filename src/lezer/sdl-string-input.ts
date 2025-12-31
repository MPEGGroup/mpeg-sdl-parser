import type { Input } from "@lezer/common";

/**
 * The `SdlStringInput` class implements the `Input` interface for a string input.
 * It provides methods to read and chunk the input string.
 */
export class SdlStringInput implements Input {
  private readonly input: string;

  constructor(input: string) {
    this.input = input.replace(/\r\n?/g, "\n");
  }

  /**
    The length of the document.
    */
  get length() {
    return this.input.length;
  }

  /**
   * Get the chunk from the given position. The returned string
   * starts at `from` (0-based) and, if that isn't the end of the
   * string, may be of any length greater than zero.
   *
   * @param from - The starting position of the chunk (0-based, inclusive).
   */
  chunk(from: number): string {
    return this.input.slice(from);
  }

  /**
   * Indicates that the chunks do not already end at line breaks and that
   * client code that wants to work by-line must scanning for line breaks.
   */
  lineChunks = false;

  /**
   * Read the part of the document between the given positions.
   * @param from - The starting position (0-based, inclusive).
   * @param to - The ending position (0-based, exclusive).
   */
  read(from: number, to: number): string {
    return this.input.slice(from, to);
  }
}
