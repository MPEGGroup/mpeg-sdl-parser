import type { Text } from "@codemirror/state";
import { TreeCursor } from "@lezer/common";
import type { Location } from "./Location.ts";
import { getLocationFromTextPosition } from "./util/locationUtils.ts";
import { isPrimitiveNodeType } from "./util/nodeUtils.ts";

/**
 * Base error class.
 */
export abstract class ParseError extends Error {
  protected constructor(
    public errorMessage: string,
    public location?: Location,
  ) {
    super(
      errorMessage +
        (location
          ? ` => { row: ${location.row}, column: ${location.column}, position: ${location.position} }`
          : ""),
    );
  }
}

/**
 * Indicates an internal logic error in the parsing implementation.
 */
export class InternalParseError extends ParseError {
  constructor(errorMessage: string, location?: Location) {
    super(`INTERNAL ERROR: ${errorMessage}`, location);
  }
}

/**
 * Indicates a syntactic error when parsing.
 */
export class SyntacticParseError extends ParseError {
  constructor(
    errorMessage: string,
    location?: Location,
    public errorLine?: string,
    public preceedingLines?: string[],
  ) {
    super(`SYNTACTIC ERROR: ${errorMessage}`, location);
  }

  /**
   * Helper function to create a SyntacticParseError from the text and a cursor.
   *
   * @param text The text to parse.
   * @param cursor The cursor position in the text.
   */
  static fromTextAndCursor(
    text: Text,
    cursor: TreeCursor,
  ): SyntacticParseError {
    if (!cursor.type.isError) {
      throw new InternalParseError(
        "Expected cursor to be an error token, but it is not",
      );
    }

    // if the error token has a child, the child is an unexpected token
    const unexpectedToken = cursor.firstChild();

    let message;

    if (unexpectedToken) {
      message = 'Unexpected token: "' +
        text.sliceString(cursor.from, cursor.to) + '"';

      if (isPrimitiveNodeType(cursor.type)) {
        message += " (" + cursor.name + ")";
      }
    } else {
      message = "Missing expected token";
    }

    return this.fromTextAndPosition(
      text,
      cursor.from,
      message,
    );
  }

  /**
   * Helper function to create a SyntacticParseError from the text and a position.
   *
   * @param text The text to parse.
   * @param position The position in the text, 0-based.
   * @param message The error message, defaults to "Parse error".
   */
  static fromTextAndPosition(
    text: Text,
    position: number,
    message: string = "Parse error",
  ): SyntacticParseError {
    const line = text.lineAt(position);
    const location = getLocationFromTextPosition(text, position);
    const preceedingLines = [];
    // Collect up to two preceding lines if available
    if (location.row > 1) {
      // First preceding line (if exists)
      preceedingLines.push(text.line(location.row - 1).text);
      // Second preceding line (if exists)
      if (location.row > 2) {
        preceedingLines.unshift(text.line(location.row - 2).text);
      }
    }

    return new SyntacticParseError(
      message,
      location,
      line.text,
      preceedingLines,
    );
  }
}
