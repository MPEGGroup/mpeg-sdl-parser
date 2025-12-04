import type { RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { CompoundStatement } from "./compound-statement.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

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
