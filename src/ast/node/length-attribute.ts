import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class LengthAttribute extends AbstractCompositeNode {
  constructor(
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly length: RequiredNode<
      NumberLiteral | Identifier | AbstractExpression
    >,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.LENGTH_ATTRIBUTE,
      children,
    );
  }
}
