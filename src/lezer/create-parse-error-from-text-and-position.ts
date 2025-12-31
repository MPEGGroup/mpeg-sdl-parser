import type { Text } from "@codemirror/state";
import { SyntacticParseError } from "../parse-error.ts";
import { getLocationFromTextPosition } from "../util/location-utils.ts";

/**
 * Helper function to create a SyntacticParseError from the text and a position.
 *
 * @param text The text to parse.
 * @param position The position in the text, 0-based.
 * @param message The error message, defaults to "Parse error".
 */
export function createParseErrorFromTextAndPosition(
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
