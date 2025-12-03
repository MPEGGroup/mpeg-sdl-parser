import type { OneToManyList } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { NumberLiteralKind } from "./enum/number_literal_kind.ts";
import type { Token } from "./Token.ts";

export class NumberLiteral extends AbstractCompositeNode {
  constructor(
    public readonly numberLiteralKind: NumberLiteralKind,
    public readonly value: number,
    // defined as an array to support multiple concatenated multiple character literal tokens
    public readonly literals: OneToManyList<Token>,
  ) {
    super(NodeKind.NUMBER_LITERAL, literals);
    this.numberLiteralKind = numberLiteralKind;
    this.value = value;
  }
}
