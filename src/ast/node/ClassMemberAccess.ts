import type { RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { Token } from "./Token.ts";

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
