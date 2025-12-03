/**
 * Enum representing different kinds of nodes.
 */
export enum NodeKind {
  /** Error placeholder for unexpected node */
  UNEXPECTED_ERROR = -2,
  /** Error placeholder for missing node */
  MISSING_ERROR = -1,
  /** Output value node */
  AGGREGATE_OUTPUT_VALUE,
  /** Aligned modifier node */
  ALIGNED_MODIFIER,
  /** Array dimension node */
  ARRAY_DIMENSION,
  /** Array element access node */
  ARRAY_ELEMENT_ACCESS,
  /** Bit modifier node */
  BIT_MODIFIER,
  /** Switch case clause node */
  CASE_CLAUSE,
  /** Class ID node */
  CLASS_ID,
  /** Class member access node */
  CLASS_MEMBER_ACCESS,
  /** Switch default clause node */
  DEFAULT_CLAUSE,
  /** Elementary type node */
  ELEMENTARY_TYPE,
  /** Elementary type output value node */
  ELEMENTARY_TYPE_OUTPUT_VALUE,
  /** Expandable modifier node */
  EXPANDABLE_MODIFIER,
  /** Expression node */
  EXPRESSION,
  /** Extends modifier node */
  EXTENDS_MODIFIER,
  /** Identifier node */
  IDENTIFIER,
  /** Length attribute node */
  LENGTH_ATTRIBUTE,
  /** Map entry node */
  MAP_ENTRY,
  /** Number literal node */
  NUMBER_LITERAL,
  /** Parameter node */
  PARAMETER,
  /** Parameter list node */
  PARAMETER_LIST,
  /** Parameter value list node */
  PARAMETER_VALUE_LIST,
  /** Specification node */
  SPECIFICATION,
  /** Statement node */
  STATEMENT,
  /** String literal node */
  STRING_LITERAL,
  /** Syntax token node */
  TOKEN,
}
