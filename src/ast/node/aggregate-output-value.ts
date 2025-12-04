import type { AbstractNode } from "./abstract-node.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { ElementaryTypeOutputValue } from "./elementary-type-output-value.ts";
import type { Token } from "./token.ts";
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
