import type { RequiredNode } from "../util/types.ts";
import { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ExpressionKind } from "./enum/expression_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { Token } from "./Token.ts";

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
