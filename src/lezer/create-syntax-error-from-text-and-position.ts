import type { Text } from "@codemirror/state";
import { SyntaxError } from "../scanner-error.ts";
import { getLocationFromTextPosition } from "../util/location-utils.ts";

/**
 * Helper function to create a SyntaxError from the text and a position.
 *
 * @param text The text to parse.
 * @param position The position in the text, 0-based.
 * @param message The error message, defaults to "Syntax error".
 */
export function createSyntaxErrorFromTextAndPosition(
  text: Text,
  position: number,
  message: string = "",
): SyntaxError {
  const line = text.lineAt(position);
  const location = getLocationFromTextPosition(text, position);
  const precedingLines = [];
  // Collect up to two preceding lines if available
  if (location.row > 1) {
    // First preceding line (if exists)
    precedingLines.push(text.line(location.row - 1).text);
    // Second preceding line (if exists)
    if (location.row > 2) {
      precedingLines.unshift(text.line(location.row - 2).text);
    }
  }

  return new SyntaxError(
    message,
    location,
    line.text,
    precedingLines,
  );
}
