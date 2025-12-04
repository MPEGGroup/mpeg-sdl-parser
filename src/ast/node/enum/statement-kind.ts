/**
 * Enum representing different kinds of statements.
 */
export enum StatementKind {
  /** Array definition statement */
  ARRAY_DEFINITION,
  /** Computed array definition statement */
  COMPUTED_ARRAY_DEFINITION,
  /** Computed elementary type definition statement */
  COMPUTED_ELEMENTARY_TYPE_DEFINITION,
  /** Class declaration statement */
  CLASS_DECLARATION,
  /** Class definition statement */
  CLASS_DEFINITION,
  /** Compound statement */
  COMPOUND,
  /** Do statement */
  DO,
  /** Elementary type definition statement */
  ELEMENTARY_TYPE_DEFINITION,
  /** Expression statement */
  EXPRESSION,
  /** For statement */
  FOR,
  /** If statement */
  IF,
  /** Map declaration statement */
  MAP_DECLARATION,
  /** Map definition statement */
  MAP_DEFINITION,
  /** String definition statement */
  STRING_DEFINITION,
  /** Switch statement */
  SWITCH,
  /** While statement */
  WHILE,
}
