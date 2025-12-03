import type { OneToManyList } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import { StringLiteralKind } from "./enum/string_literal_kind.ts";
import type { Token } from "./Token.ts";

export class StringLiteral extends AbstractCompositeNode {
  constructor(
    public readonly stringLiteralKind: StringLiteralKind,
    public readonly value: string,
    // an array to support multiple concatenated string literal tokens
    public readonly literals: OneToManyList<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.STRING_LITERAL,
      children,
    );
  }
}
