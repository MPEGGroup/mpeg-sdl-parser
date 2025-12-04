/**
 * Represents a location within a text document.
 *
 * @interface Location
 * @property {number} row - The one-based row number in the text document.
 * @property {number} column - The one-based column number in the text document.
 * @property {number} position - The zero-based position within the entire text.
 */
export interface Location {
  readonly row: number;
  readonly column: number;
  readonly position: number;
}
