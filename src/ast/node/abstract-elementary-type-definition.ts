import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { ElementaryType } from "./elementary-type.ts";
import type { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

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
