import type { OptionalNode, RequiredNode } from "../util/types.ts";
import { AbstractElementaryTypeDefinition } from "./AbstractElementaryTypeDefinition.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { AlignedModifier } from "./AlignedModifier.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import type { Identifier } from "./Identifier.ts";
import type { LengthAttribute } from "./LengthAttribute.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";
import type { Token } from "./Token.ts";
import { StatementKind } from "./enum/statement_kind.ts";

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
