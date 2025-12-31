import type { OneToManyList, RequiredNode } from "../util/types.ts";
import { AbstractArrayDefinition } from "./abstract-array-definition.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { ElementaryType } from "./elementary-type.ts";
import type { ExplicitArrayDimension } from "./explicit-array-dimension.ts";
import type { Identifier } from "./identifier.ts";
import type { Token } from "./token.ts";
import { StatementKind } from "./enum/statement-kind.ts";

export class ComputedArrayDefinition extends AbstractArrayDefinition {
  constructor(
    public readonly computedKeyword: RequiredNode<Token>,
    public readonly elementaryType: RequiredNode<ElementaryType>,
    identifier: RequiredNode<Identifier>,
    public readonly dimensions: OneToManyList<ExplicitArrayDimension>,
    semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.COMPUTED_ARRAY_DEFINITION,
      identifier,
      semicolonPunctuator,
      children,
    );
  }
}
