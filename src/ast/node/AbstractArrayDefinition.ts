import type { RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { Token } from "./Token.ts";

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
