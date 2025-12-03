import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import type { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

export abstract class AbstractElementaryTypeDefinition
  extends AbstractStatement {
  constructor(
    kind: StatementKind,
    public readonly constKeyword: OptionalNode<Token>,
    public readonly elementaryType: RequiredNode<ElementaryType>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly assignmentOperator: OptionalNode<Token>,
    public readonly value: OptionalNode<
      | AbstractExpression
      | NumberLiteral
      | Identifier
    >,
    public readonly semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(kind, children);
  }
}
