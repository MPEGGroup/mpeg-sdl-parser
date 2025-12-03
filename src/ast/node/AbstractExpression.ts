import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ExpressionKind } from "./enum/expression_kind.ts";
import { NodeKind } from "./enum/node_kind.ts";

export abstract class AbstractExpression extends AbstractCompositeNode {
  constructor(
    public readonly expressionKind: ExpressionKind,
    children: AbstractNode[],
  ) {
    super(NodeKind.EXPRESSION, children);
  }
}
