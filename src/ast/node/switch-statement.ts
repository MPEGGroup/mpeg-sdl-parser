import type { AbstractExpression } from "./abstract-expression.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { CaseClause } from "./case-clause.ts";
import type { DefaultClause } from "./default-clause.ts";
import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import type { Token } from "./token.ts";
import type { AbstractNode } from "./abstract-node.ts";

export class SwitchStatement extends AbstractStatement {
  constructor(
    public readonly switchKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly expression: RequiredNode<
      AbstractExpression | Identifier | NumberLiteral
    >,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    public readonly openBracePunctuator: RequiredNode<Token>,
    public readonly caseClauses: ZeroToManyList<CaseClause>,
    public readonly defaultClause: OptionalNode<DefaultClause>,
    public readonly closeBracePunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(StatementKind.SWITCH, children);
  }
}
