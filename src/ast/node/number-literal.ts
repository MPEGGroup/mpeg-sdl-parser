import type { OneToManyList } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { NumberLiteralKind } from "./enum/number-literal-kind.ts";
import type { Token } from "./token.ts";

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
