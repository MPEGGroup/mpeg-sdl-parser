import { TokenKind } from "./enum/token-kind.ts";
import { Token } from "./token.ts";
import type { Location } from "../../location.ts";

export class MissingError extends Token {
  constructor(location: Location) {
    super(TokenKind.ERROR_MISSING_TOKEN, "", location);
  }
}
