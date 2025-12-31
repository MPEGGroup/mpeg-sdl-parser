import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { ParameterValueList } from "./parameter-value-list.ts";
import type { Token } from "./token.ts";

export class ExtendsModifier extends AbstractCompositeNode {
  constructor(
    public readonly extendsKeyword: RequiredNode<Token>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly parameterValueList: OptionalNode<ParameterValueList>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.EXTENDS_MODIFIER,
      children,
    );
  }
}
