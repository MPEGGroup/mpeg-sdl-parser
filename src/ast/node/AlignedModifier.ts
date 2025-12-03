import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Token } from "./Token.ts";

export class AlignedModifier extends AbstractCompositeNode {
  constructor(
    public readonly alignedKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: OptionalNode<Token>,
    public readonly bitCountModifierToken: OptionalNode<Token>,
    public readonly closeParenthesisPunctuator: OptionalNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.ALIGNED_MODIFIER,
      children,
    );
  }
}
