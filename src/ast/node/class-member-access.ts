import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { Token } from "./token.ts";

export class ClassMemberAccess extends AbstractCompositeNode {
  constructor(
    public readonly classMemberAccessOperator: RequiredNode<Token>,
    public readonly memberIdentifier: RequiredNode<Identifier>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.CLASS_MEMBER_ACCESS,
      children,
    );
  }
}
