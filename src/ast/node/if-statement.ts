import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class IfStatement extends AbstractStatement {
  constructor(
    public readonly ifKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly condition: RequiredNode<
      AbstractExpression | Identifier | NumberLiteral
    >,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    public readonly ifStatement: RequiredNode<AbstractStatement>,
    public readonly elseKeyword: OptionalNode<Token>,
    public readonly elseStatement: OptionalNode<AbstractStatement>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.IF,
      children,
    );
  }
}
