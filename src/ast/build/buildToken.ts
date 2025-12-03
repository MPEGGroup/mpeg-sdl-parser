import { InternalParseError } from "../../ParseError.ts";
import type { BuildContext } from "./BuildContext.ts";
import { Token } from "../node/Token.ts";
import { tokenKindByTokenTypeId } from "../node/enum/token_kind.ts";
import { syntacticTokenNodeProp } from "../../lezer/props/syntacticTokenNodePropSource.ts";
import { getLocationFromTextPosition } from "../../util/locationUtils.ts";

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
