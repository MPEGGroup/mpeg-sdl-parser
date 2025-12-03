import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Token } from "./Token.ts";

export class UnexpectedError extends AbstractCompositeNode {
  constructor(
    public readonly unexpectedToken: Token,
  ) {
    super(NodeKind.UNEXPECTED_ERROR, [unexpectedToken]);
  }
}
