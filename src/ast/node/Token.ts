import type { Location } from "../../Location.ts";
import { AbstractLeafNode } from "./AbstractLeafNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { TokenKind } from "./enum/token_kind.ts";

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
