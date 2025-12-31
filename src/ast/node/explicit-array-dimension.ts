import type { RequiredNode } from "../util/types.ts";
import { AbstractArrayDimension } from "./abstract-array-dimension.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ArrayDimensionKind } from "./enum/array-dimension-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class ExplicitArrayDimension extends AbstractArrayDimension {
  constructor(
    openBracketPunctuator: RequiredNode<Token>,
    public readonly size: RequiredNode<
      AbstractExpression | Identifier | NumberLiteral
    >,
    closeBracketPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      ArrayDimensionKind.EXPLICIT,
      openBracketPunctuator,
      closeBracketPunctuator,
      children,
    );
  }
}
