import { AbstractStatement } from "./abstract-statement.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { Identifier } from "./identifier.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { Token } from "./token.ts";
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
