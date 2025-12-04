import { AbstractNode } from "./abstract-node.ts";
import type { NodeKind } from "./enum/node-kind.ts";

export abstract class AbstractLeafNode extends AbstractNode {
  constructor(
    nodeKind: NodeKind,
  ) {
    super(nodeKind, false);
  }
}
