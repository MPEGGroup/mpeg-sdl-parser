import type { RequiredNode, ZeroToManyList } from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Token } from "./token.ts";

export class CompoundStatement extends AbstractStatement {
  constructor(
    public readonly openBracePunctuator: RequiredNode<Token>,
    public readonly statements: ZeroToManyList<AbstractStatement>,
    public readonly closeBracePunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.COMPOUND,
      children,
    );
  }
}
