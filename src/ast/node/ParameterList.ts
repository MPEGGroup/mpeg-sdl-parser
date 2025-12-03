import type {
  OneToManyList,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Parameter } from "./Parameter.ts";
import type { Token } from "./Token.ts";

export class ParameterList extends AbstractCompositeNode {
  constructor(
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly parameters: OneToManyList<Parameter>,
    public readonly commaPunctuators: ZeroToManyList<Token>,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.PARAMETER_LIST,
      children,
    );
  }
}
