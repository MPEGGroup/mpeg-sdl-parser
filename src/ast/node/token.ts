import type { Location } from "../../location.ts";
import { AbstractLeafNode } from "./abstract-leaf-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { TokenKind } from "./enum/token-kind.ts";

export class Token extends AbstractLeafNode {
  constructor(
    public readonly tokenKind: TokenKind,
    public readonly text: string,
    public readonly location: Location,
  ) {
    super(
      NodeKind.TOKEN,
    );
  }
}
