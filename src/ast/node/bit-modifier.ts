import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractClassId } from "./abstract-class-id.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

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
