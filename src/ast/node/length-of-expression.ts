import type { RequiredNode } from "../util/types.ts";
import { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ExpressionKind } from "./enum/expression-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { Token } from "./token.ts";

export class LengthofExpression extends AbstractExpression {
  constructor(
    public readonly lengthOfKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly operand: RequiredNode<AbstractExpression | Identifier>,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      ExpressionKind.LENGTHOF,
      children,
    );
  }
}
