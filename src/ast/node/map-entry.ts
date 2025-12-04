import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { AggregateOutputValue } from "./aggregate-output-value.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class MapEntry extends AbstractCompositeNode {
  constructor(
    public readonly inputValue: RequiredNode<NumberLiteral>,
    public readonly commaPunctuator: RequiredNode<Token>,
    public readonly outputValue: RequiredNode<AggregateOutputValue>,
    children: Array<AbstractNode>,
  ) {
    super(NodeKind.MAP_ENTRY, children);
  }
}
