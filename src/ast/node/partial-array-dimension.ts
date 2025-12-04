import type { RequiredNode } from "../util/types.ts";
import { AbstractArrayDimension } from "./abstract-array-dimension.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ArrayDimensionKind } from "./enum/array-dimension-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

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
