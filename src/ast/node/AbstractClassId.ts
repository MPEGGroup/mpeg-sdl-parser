import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ClassIdKind } from "./enum/class_id_kind.ts";
import { NodeKind } from "./enum/node_kind.ts";

export abstract class AbstractClassId extends AbstractCompositeNode {
  constructor(
    public readonly classIdKind: ClassIdKind,
    children: Array<AbstractNode>,
  ) {
    super(NodeKind.CLASS_ID, children);
  }
}
