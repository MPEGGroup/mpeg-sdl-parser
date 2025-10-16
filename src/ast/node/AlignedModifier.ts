import type { Token } from "../token/Token.ts";
import { AbstractLeafNode } from "./AbstractLeafNode.ts";
import { NodeKind } from "./enum/node_kind.ts";

export class AlignedModifier extends AbstractLeafNode {
  constructor(
    public readonly bitCount: number,
    public readonly isDefault8BitCount: boolean,
    public readonly bitCountModifierToken: Token | undefined,
    public readonly alignedKeyword: Token,
    public readonly openParenthesisPunctuator?: Token,
    public readonly closeParenthesisPunctuator?: Token,
  ) {
    super(
      NodeKind.ALIGNED_MODIFIER,
      alignedKeyword,
      closeParenthesisPunctuator ?? alignedKeyword,
    );
  }

  toString(): string {
    return this.bitCount.toString();
  }
}
