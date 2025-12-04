import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { AbstractStatement } from "./abstract-statement.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

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
