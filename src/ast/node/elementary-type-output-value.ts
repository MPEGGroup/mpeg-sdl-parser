import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { LengthAttribute } from "./length-attribute.ts";
import type { ElementaryType } from "./elementary-type.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { RequiredNode } from "../util/types.ts";

export class ElementaryTypeOutputValue extends AbstractCompositeNode {
  constructor(
    public readonly elementaryType: RequiredNode<ElementaryType>,
    public readonly lengthAttribute: RequiredNode<LengthAttribute>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE,
      children,
    );
  }
}
