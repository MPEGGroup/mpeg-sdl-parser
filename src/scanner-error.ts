import type { Location } from "./location.ts";

/**
 * Base error class.
 */
export abstract class ScannerError extends Error {
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
 * Indicates an internal logic error in the scanner implementation.
 */
export class InternalScannerError extends ScannerError {
  constructor(errorMessage: string, location?: Location) {
    super(`INTERNAL SCANNER ERROR: ${errorMessage}`, location);
  }
}

/**
 * Indicates a syntactic error in the provided source.
 */
export class SyntaxError extends ScannerError {
  constructor(
    errorMessage: string,
    location?: Location,
    public errorLine?: string,
    public precedingLines?: string[],
  ) {
    super(`SYNTAX ERROR: ${errorMessage}`.trim(), location);
  }
}

/**
 * Indicates a semantic error in the provided AST.
 */
export class SemanticError extends ScannerError {
  constructor(
    errorMessage: string,
    location?: Location,
    public errorLine?: string,
    public precedingLines?: string[],
  ) {
    super(`SEMANTIC ERROR: ${errorMessage}`.trim(), location);
  }
}
