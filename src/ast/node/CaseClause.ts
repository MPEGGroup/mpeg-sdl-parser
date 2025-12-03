import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { AbstractStatement } from "./AbstractStatement.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export class CaseClause extends AbstractCompositeNode {
  constructor(
    public readonly caseKeyword: RequiredNode<Token>,
    public readonly value: RequiredNode<NumberLiteral>,
    public readonly colonPunctuator: RequiredNode<Token>,
    public readonly openBracePunctuator: OptionalNode<Token>,
    public readonly statements: ZeroToManyList<AbstractStatement>,
    public readonly breakKeyword: OptionalNode<Token>,
    public readonly semicolonPunctuator: OptionalNode<Token>,
    public readonly closeBracePunctuator: OptionalNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      NodeKind.CASE_CLAUSE,
      children,
    );
  }
}
