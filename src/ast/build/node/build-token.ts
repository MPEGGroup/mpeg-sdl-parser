import { InternalParseError } from "../../../parse-error.ts";
import type { BuildContext } from "../util/build-context.ts";
import { Token } from "../../node/token.ts";
import { syntacticTokenNodeProp } from "../../../lezer/props/syntactic-token-node-prop-source.ts";
import { getLocationFromTextPosition } from "../../../util/location-utils.ts";
import { tokenKindByTokenTypeId } from "../util/token-kind-by-token-type-id-map.ts";

export function buildToken(
  buildContext: BuildContext,
): Token {
  const { cursor, text } = buildContext;
  const tokenKind = tokenKindByTokenTypeId.get(cursor.type.id);

  if (tokenKind === undefined) {
    throw new InternalParseError(
      `No TokenKind mapping found for token type id: ${cursor.type.id} (${cursor.type.name})`,
    );
  }

  // Assuming the syntacticTokenNodeProp is easier to get than slicing the text each time
  const tokenText = cursor.type.prop(syntacticTokenNodeProp) ||
    text.sliceString(cursor.from, cursor.to);
  const location = getLocationFromTextPosition(text, cursor.from);

  return new Token(tokenKind, tokenText, location);
}
