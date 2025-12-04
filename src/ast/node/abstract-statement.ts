import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import { StatementKind } from "./enum/statement-kind.ts";

export abstract class AbstractStatement extends AbstractCompositeNode {
  constructor(
    public readonly statementKind: StatementKind,
    public readonly children: Array<AbstractNode>,
  ) {
    super(NodeKind.STATEMENT, children);
  }
}
