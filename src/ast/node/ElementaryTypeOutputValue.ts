import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { LengthAttribute } from "./LengthAttribute.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import type { AbstractNode } from "./AbstractNode.ts";
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
