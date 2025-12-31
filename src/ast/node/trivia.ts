import type { Location } from "../../location.ts";

/**
 * Represents a parsed trivia item.
 *
 * @interface Trivia
 * @property {string} text - The text content of the trivia.
 * @property {Location} location - The location of the trivia.
 */
export interface Trivia {
  readonly text: string;
  readonly location: Location;
}
