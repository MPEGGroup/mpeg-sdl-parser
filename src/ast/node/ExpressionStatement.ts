import { AbstractStatement } from "./AbstractStatement.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { Identifier } from "./Identifier.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { Token } from "./Token.ts";
import type { RequiredNode } from "../util/types.ts";

export class ExpressionStatement extends AbstractStatement {
  constructor(
    public readonly expression: RequiredNode<
      AbstractExpression | Identifier | NumberLiteral
    >,
    public readonly semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.EXPRESSION,
      children,
    );
  }
}
