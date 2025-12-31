import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ExpressionKind } from "./enum/expression-kind.ts";
import { NodeKind } from "./enum/node-kind.ts";

export abstract class AbstractExpression extends AbstractCompositeNode {
  constructor(
    public readonly expressionKind: ExpressionKind,
    children: AbstractNode[],
  ) {
    super(NodeKind.EXPRESSION, children);
  }
}
