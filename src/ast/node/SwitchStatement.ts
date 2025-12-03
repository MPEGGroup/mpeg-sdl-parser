import type { AbstractExpression } from "./AbstractExpression.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { CaseClause } from "./CaseClause.ts";
import type { DefaultClause } from "./DefaultClause.ts";
import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import type { Token } from "./Token.ts";
import type { AbstractNode } from "./AbstractNode.ts";

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
