import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { ElementaryTypeOutputValue } from "./ElementaryTypeOutputValue.ts";
import type { Token } from "./Token.ts";
import type {
  OneToManyList,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";

export class AggregateOutputValue extends AbstractCompositeNode {
  constructor(
    public readonly openBracePunctuator: RequiredNode<Token>,
    public readonly outputValues: OneToManyList<
      AggregateOutputValue | ElementaryTypeOutputValue | NumberLiteral
    >,
    public readonly commaPunctuators: ZeroToManyList<Token>,
    public readonly closeBracePunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.AGGREGATE_OUTPUT_VALUE,
      children,
    );
  }
}
