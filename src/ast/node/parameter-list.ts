import type {
  OneToManyList,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Parameter } from "./parameter.ts";
import type { Token } from "./token.ts";

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
