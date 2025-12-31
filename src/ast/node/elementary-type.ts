import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Token } from "./token.ts";

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
