import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractElementaryTypeDefinition } from "./AbstractElementaryTypeDefinition.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";

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
