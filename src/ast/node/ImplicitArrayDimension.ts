import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractArrayDimension } from "./AbstractArrayDimension.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ArrayDimensionKind } from "./enum/array_dimension_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export class ImplicitArrayDimension extends AbstractArrayDimension {
  constructor(
    openBracketPunctuator: RequiredNode<Token>,
    public readonly rangeStart: OptionalNode<
      | AbstractExpression
      | Identifier
      | NumberLiteral
    >,
    public readonly rangeOperator: OptionalNode<Token>,
    public readonly rangeEnd: OptionalNode<
      | AbstractExpression
      | Identifier
      | NumberLiteral
    >,
    closeBracketPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      ArrayDimensionKind.IMPLICIT,
      openBracketPunctuator,
      closeBracketPunctuator,
      children,
    );
  }
}
