import type { RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { Token } from "./token.ts";

export abstract class AbstractArrayDefinition extends AbstractStatement {
  constructor(
    kind: StatementKind,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(kind, children);
  }
}
