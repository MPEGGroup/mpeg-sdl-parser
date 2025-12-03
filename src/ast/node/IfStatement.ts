import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
