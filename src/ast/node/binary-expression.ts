import type { RequiredNode } from "../util/types.ts";
import { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ExpressionKind } from "./enum/expression-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class BinaryExpression extends AbstractExpression {
  constructor(
    public readonly leftOperand: RequiredNode<
      | AbstractExpression
      | Identifier
      | NumberLiteral
    >,
    public readonly binaryOperator: RequiredNode<Token>,
    public readonly rightOperand: RequiredNode<
      | AbstractExpression
      | Identifier
      | NumberLiteral
    >,
    children: Array<AbstractNode>,
  ) {
    super(ExpressionKind.BINARY, children);
  }
}
