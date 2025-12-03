import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { ParameterValueList } from "./ParameterValueList.ts";
import type { Token } from "./Token.ts";

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
