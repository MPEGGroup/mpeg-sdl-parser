import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { ArrayElementAccess } from "./ArrayElementAccess.ts";
import type { ClassMemberAccess } from "./ClassMemberAccess.ts";
import { ExpressionKind } from "./enum/expression_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
