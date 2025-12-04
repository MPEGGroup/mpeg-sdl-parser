import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractElementaryTypeDefinition } from "./abstract-elementary-type-definition.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { AlignedModifier } from "./aligned-modifier.ts";
import type { ElementaryType } from "./elementary-type.ts";
import type { Identifier } from "./identifier.ts";
import type { LengthAttribute } from "./length-attribute.ts";
import type { NumberLiteral } from "./number-literal.ts";
import type { Token } from "./token.ts";
import { StatementKind } from "./enum/statement-kind.ts";

export class ElementaryTypeDefinition extends AbstractElementaryTypeDefinition {
  constructor(
    public readonly reservedKeyword: OptionalNode<Token>,
    public readonly legacyKeyword: OptionalNode<Token>,
    constKeyword: OptionalNode<Token>,
    public readonly alignedModifier: OptionalNode<AlignedModifier>,
    elementaryType: RequiredNode<ElementaryType>,
    public readonly lengthAttribute: RequiredNode<LengthAttribute>,
    public readonly lookAheadOperator: OptionalNode<Token>,
    identifier: RequiredNode<Identifier>,
    assignmentOperator: OptionalNode<Token>,
    value: OptionalNode<
      | AbstractExpression
      | NumberLiteral
      | Identifier
    >,
    public readonly rangeOperator: OptionalNode<Token>,
    public readonly endValue: OptionalNode<
      | AbstractExpression
      | NumberLiteral
      | Identifier
    >,
    semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.ELEMENTARY_TYPE_DEFINITION,
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
