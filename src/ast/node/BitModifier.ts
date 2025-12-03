import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractClassId } from "./AbstractClassId.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export class BitModifier extends AbstractCompositeNode {
  constructor(
    public readonly colonPunctuator: RequiredNode<Token>,
    public readonly bitKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly length: RequiredNode<NumberLiteral>,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    public readonly identifier: OptionalNode<Identifier>,
    public readonly assignmentOperator: OptionalNode<Token>,
    public readonly classId: RequiredNode<AbstractClassId>,
    children: Array<AbstractNode>,
  ) {
    super(NodeKind.BIT_MODIFIER, children);
  }
}
