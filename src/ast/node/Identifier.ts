import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Token } from "./Token.ts";

export class Identifier extends AbstractCompositeNode {
  constructor(
    public readonly name: string,
    token: Token,
  ) {
    super(NodeKind.IDENTIFIER, [token]);
  }
}
