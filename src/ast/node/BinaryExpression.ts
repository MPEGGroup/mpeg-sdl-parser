import type { RequiredNode } from "../util/types.ts";
import { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ExpressionKind } from "./enum/expression_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
