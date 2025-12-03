import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { AggregateOutputValue } from "./AggregateOutputValue.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
