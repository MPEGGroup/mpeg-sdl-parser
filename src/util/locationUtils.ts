import { Text } from "@codemirror/state";
import type { Location } from "../Location.ts";

export function getLocationFromTextPosition(
  text: Text,
  position: number,
): Location {
  const line = text.lineAt(position);
  const row = line.number;
  const column = position - line.from + 1;
  return {
    row,
    column,
    position,
  };
}
