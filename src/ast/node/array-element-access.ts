import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class ArrayElementAccess extends AbstractCompositeNode {
  constructor(
    public readonly openBracketPunctuator: RequiredNode<Token>,
    public readonly index: RequiredNode<
      AbstractExpression | NumberLiteral | Identifier
    >,
    public readonly closeBracketPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.ARRAY_ELEMENT_ACCESS,
      children,
    );
  }
}
