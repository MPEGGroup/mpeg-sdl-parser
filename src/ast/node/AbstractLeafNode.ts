import { AbstractNode } from "./AbstractNode.ts";
import type { NodeKind } from "./enum/node_kind.ts";

export abstract class AbstractLeafNode extends AbstractNode {
  constructor(
    nodeKind: NodeKind,
  ) {
    super(nodeKind, false);
  }
}
