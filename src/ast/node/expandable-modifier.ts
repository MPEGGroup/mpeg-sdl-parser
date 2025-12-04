import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class ExpandableModifier extends AbstractCompositeNode {
  constructor(
    public readonly expandableKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: OptionalNode<Token>,
    public readonly maxClassSize: OptionalNode<NumberLiteral>,
    public readonly closeParenthesisPunctuator: OptionalNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.EXPANDABLE_MODIFIER,
      children,
    );
  }
}
