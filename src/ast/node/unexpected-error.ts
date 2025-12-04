import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Token } from "./token.ts";

export class UnexpectedError extends AbstractCompositeNode {
  constructor(
    public readonly unexpectedToken: Token,
  ) {
    super(NodeKind.UNEXPECTED_ERROR, [unexpectedToken]);
  }
}
