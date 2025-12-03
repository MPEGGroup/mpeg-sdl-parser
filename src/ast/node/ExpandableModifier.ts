import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
