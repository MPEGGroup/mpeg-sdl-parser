import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { ElementaryType } from "./elementary-type.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Identifier } from "./identifier.ts";

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
