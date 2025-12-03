import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Identifier } from "./Identifier.ts";

export class Parameter extends AbstractCompositeNode {
  constructor(
    public readonly classIdentifier: OptionalNode<Identifier>,
    public readonly elementaryType: OptionalNode<ElementaryType>,
    public readonly identifier: RequiredNode<Identifier>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.PARAMETER,
      children,
    );
  }
}
