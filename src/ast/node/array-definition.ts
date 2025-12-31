import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractArrayDefinition } from "./abstract-array-definition.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { AlignedModifier } from "./aligned-modifier.ts";
import type { ElementaryType } from "./elementary-type.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { ExplicitArrayDimension } from "./explicit-array-dimension.ts";
import type { Identifier } from "./identifier.ts";
import type { ImplicitArrayDimension } from "./implicit-array-dimension.ts";
import type { LengthAttribute } from "./length-attribute.ts";
import type { PartialArrayDimension } from "./partial-array-dimension.ts";
import type { Token } from "./token.ts";

export class ArrayDefinition extends AbstractArrayDefinition {
  constructor(
    public readonly reservedKeyword: OptionalNode<Token>,
    public readonly legacyKeyword: OptionalNode<Token>,
    public readonly alignedModifier: OptionalNode<AlignedModifier>,
    public readonly elementaryType: OptionalNode<ElementaryType>,
    public readonly lengthAttribute: OptionalNode<LengthAttribute>,
    public readonly classIdentifier: OptionalNode<Identifier>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly implicitArrayDimension: OptionalNode<
      ImplicitArrayDimension
    >,
    public readonly dimensions: ZeroToManyList<
      | ExplicitArrayDimension
      | PartialArrayDimension
    >,
    semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.ARRAY_DEFINITION,
      identifier,
      semicolonPunctuator,
      children,
    );
  }
}
