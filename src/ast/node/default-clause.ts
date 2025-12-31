import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { AbstractStatement } from "./abstract-statement.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { Token } from "./token.ts";

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
