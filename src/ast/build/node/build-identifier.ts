import { Identifier } from "../../node/identifier.ts";
import type { Token } from "../../node/token.ts";

export function buildIdentifier(
  token: Token,
): Identifier {
  return new Identifier(token.text, token);
}
