import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";

export class UnexpectedError extends AbstractCompositeNode {
  constructor(
    public readonly unexpectedToken: RequiredNode<AbstractNode>,
  ) {
    super(NodeKind.UNEXPECTED_ERROR, [unexpectedToken]);
  }
}
