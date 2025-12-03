import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import { StatementKind } from "./enum/statement_kind.ts";

export abstract class AbstractStatement extends AbstractCompositeNode {
  constructor(
    public readonly statementKind: StatementKind,
    public readonly children: Array<AbstractNode>,
  ) {
    super(NodeKind.STATEMENT, children);
  }
}
