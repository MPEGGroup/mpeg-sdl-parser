import type { RequiredNode } from "../util/types.ts";
import { AbstractArrayDimension } from "./AbstractArrayDimension.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ArrayDimensionKind } from "./enum/array_dimension_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export class PartialArrayDimension extends AbstractArrayDimension {
  constructor(
    openBracketPunctuator: RequiredNode<Token>,
    public readonly innerOpenBracketPunctuator: RequiredNode<Token>,
    public readonly index: RequiredNode<
      AbstractExpression | Identifier | NumberLiteral
    >,
    public readonly innerCloseBracketPunctuator: RequiredNode<Token>,
    closeBracketPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      ArrayDimensionKind.PARTIAL,
      openBracketPunctuator,
      closeBracketPunctuator,
      children,
    );
  }
}
