import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import { AbstractArrayDefinition } from "./AbstractArrayDefinition.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { AlignedModifier } from "./AlignedModifier.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { ExplicitArrayDimension } from "./ExplicitArrayDimension.ts";
import type { Identifier } from "./Identifier.ts";
import type { ImplicitArrayDimension } from "./ImplicitArrayDimension.ts";
import type { LengthAttribute } from "./LengthAttribute.ts";
import type { PartialArrayDimension } from "./PartialArrayDimension.ts";
import type { Token } from "./Token.ts";

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
