import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { AbstractStatement } from "./AbstractStatement.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Token } from "./Token.ts";

export class DefaultClause extends AbstractCompositeNode {
  constructor(
    public readonly defaultKeyword: RequiredNode<Token>,
    public readonly colonPunctuator: RequiredNode<Token>,
    public readonly openBracePunctuator: OptionalNode<Token>,
    public readonly statements: ZeroToManyList<AbstractStatement>,
    public readonly closeBracePunctuator: OptionalNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.DEFAULT_CLAUSE,
      children,
    );
  }
}
