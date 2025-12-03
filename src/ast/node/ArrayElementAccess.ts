import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
