import { TokenKind } from "./enum/token_kind.ts";
import { Token } from "./Token.ts";
import type { Location } from "../../Location.ts";

export class MissingError extends Token {
  constructor(location: Location) {
    super(TokenKind.ERROR_MISSING_TOKEN, "<missing>", location);
  }
}
