import type { OneToManyList } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import { StringLiteralKind } from "./enum/string-literal-kind.ts";
import type { Token } from "./token.ts";

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
