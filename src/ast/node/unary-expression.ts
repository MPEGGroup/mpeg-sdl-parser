import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { ArrayElementAccess } from "./array-element-access.ts";
import type { ClassMemberAccess } from "./class-member-access.ts";
import { ExpressionKind } from "./enum/expression-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class UnaryExpression extends AbstractExpression {
  constructor(
    public readonly unaryOperator: OptionalNode<Token>,
    public readonly openParenthesisPunctuator: OptionalNode<Token>,
    public readonly operand: RequiredNode<
      | AbstractExpression
      | Identifier
      | NumberLiteral
    >,
    public readonly closeParenthesisPunctuator: OptionalNode<Token>,
    public readonly arrayElementAccess: OptionalNode<ArrayElementAccess>,
    public readonly classMemberAccess: OptionalNode<ClassMemberAccess>,
    public readonly postfixOperator: OptionalNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      ExpressionKind.UNARY,
      children,
    );
  }
}
