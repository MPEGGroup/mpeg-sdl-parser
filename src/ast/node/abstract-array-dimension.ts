import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ArrayDimensionKind } from "./enum/array-dimension-kind.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Token } from "./token.ts";

export abstract class AbstractArrayDimension extends AbstractCompositeNode {
  constructor(
    public readonly arrayDimensionKind: ArrayDimensionKind,
    public readonly openBracketPunctuator: RequiredNode<Token>,
    public readonly closeBracketPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.ARRAY_DIMENSION,
      children,
    );
  }
}
