import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Token } from "./token.ts";

export class Identifier extends AbstractCompositeNode {
  constructor(
    public readonly name: string,
    token: Token,
  ) {
    super(NodeKind.IDENTIFIER, [token]);
  }
}
