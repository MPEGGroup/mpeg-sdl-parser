import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Token } from "./Token.ts";

export class ElementaryType extends AbstractCompositeNode {
  constructor(
    public readonly unsignedQualifierKeyword: OptionalNode<Token>,
    public readonly typeKeyword: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.ELEMENTARY_TYPE,
      children,
    );
  }
}
