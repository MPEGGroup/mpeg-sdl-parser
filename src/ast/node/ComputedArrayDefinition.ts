import type { OneToManyList, RequiredNode } from "../util/types.ts";
import { AbstractArrayDefinition } from "./AbstractArrayDefinition.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import type { ExplicitArrayDimension } from "./ExplicitArrayDimension.ts";
import type { Identifier } from "./Identifier.ts";
import type { Token } from "./Token.ts";
import { StatementKind } from "./enum/statement_kind.ts";

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
