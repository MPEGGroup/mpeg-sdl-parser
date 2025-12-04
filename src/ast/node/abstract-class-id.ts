import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ClassIdKind } from "./enum/class-id-kind.ts";
import { NodeKind } from "./enum/node-kind.ts";

export abstract class AbstractClassId extends AbstractCompositeNode {
  constructor(
    public readonly classIdKind: ClassIdKind,
    children: Array<AbstractNode>,
  ) {
    super(NodeKind.CLASS_ID, children);
  }
}
