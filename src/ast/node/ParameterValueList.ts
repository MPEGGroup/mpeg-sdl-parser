import type {
  OneToManyList,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export class ParameterValueList extends AbstractCompositeNode {
  constructor(
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly values: OneToManyList<
      AbstractExpression | Identifier | NumberLiteral
    >,
    public readonly commaPunctuators: ZeroToManyList<Token>,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.PARAMETER_VALUE_LIST,
      children,
    );
  }
}
