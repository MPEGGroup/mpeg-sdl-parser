import { Identifier } from "../node/Identifier.ts";
import type { Token } from "../node/Token.ts";

export function buildIdentifier(
  token: Token,
): Identifier {
  return new Identifier(token.text, token);
}
