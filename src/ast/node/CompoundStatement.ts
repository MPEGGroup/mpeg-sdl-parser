import type { RequiredNode, ZeroToManyList } from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Token } from "./Token.ts";

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
