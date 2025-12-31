import { getLocationFromTextPosition } from "../../../util/location-utils.ts";
import type { BuildContext } from "../util/build-context.ts";
import { MissingError } from "../../node/missing-error.ts";

export function buildMissingError(buildContext: BuildContext): MissingError {
  const { cursor, text } = buildContext;
  const location = getLocationFromTextPosition(text, cursor.from);

  return new MissingError(location);
}
