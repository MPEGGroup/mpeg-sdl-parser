import type { Location } from "./location.ts";

/**
 * Base error class.
 */
export abstract class ParseError extends Error {
  protected constructor(
    public errorMessage: string,
    public location?: Location,
  ) {
    super(
      errorMessage +
        (location
          ? ` => { row: ${location.row}, column: ${location.column}, position: ${location.position} }`
          : ""),
    );
  }
}

/**
 * Indicates an internal logic error in the parsing implementation.
 */
export class InternalParseError extends ParseError {
  constructor(errorMessage: string, location?: Location) {
    super(`INTERNAL ERROR: ${errorMessage}`, location);
  }
}

/**
 * Indicates a syntactic error when parsing.
 */
export class SyntacticParseError extends ParseError {
  constructor(
    errorMessage: string,
    location?: Location,
    public errorLine?: string,
    public preceedingLines?: string[],
  ) {
    super(`SYNTACTIC ERROR: ${errorMessage}`, location);
  }
}
