import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractElementaryTypeDefinition } from "./abstract-elementary-type-definition.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { ElementaryType } from "./elementary-type.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";

export class ComputedElementaryTypeDefinition
  extends AbstractElementaryTypeDefinition {
  constructor(
    public readonly computedKeyword: RequiredNode<Token>,
    constKeyword: OptionalNode<Token>,
    elementaryType: RequiredNode<ElementaryType>,
    identifier: RequiredNode<Identifier>,
    assignmentOperator: OptionalNode<Token>,
    value: OptionalNode<AbstractExpression | Identifier | NumberLiteral>,
    semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION,
      constKeyword,
      elementaryType,
      identifier,
      assignmentOperator,
      value,
      semicolonPunctuator,
      children,
    );
  }
}
