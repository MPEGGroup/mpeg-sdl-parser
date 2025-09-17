import type { Location } from "../../Location.ts";
import type { Trivia } from "./Trivia.ts";

/**
 * ParseToken represents a token from the parsing process.
 */
export interface Token {
  readonly text: string;
  readonly location: Location;
  leadingTrivia: Trivia[];
  trailingTrivia: Trivia[];
}
