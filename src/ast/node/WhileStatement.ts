import type { RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { CompoundStatement } from "./CompoundStatement.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export class WhileStatement extends AbstractStatement {
  constructor(
    public readonly whileKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly condition: RequiredNode<
      AbstractExpression | Identifier | NumberLiteral
    >,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    public readonly compoundStatement: RequiredNode<CompoundStatement>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.WHILE,
      children,
    );
  }
}
