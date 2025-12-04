import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { ElementaryType } from "./elementary-type.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { Token } from "./token.ts";

export class MapDefinition extends AbstractStatement {
  constructor(
    public readonly reservedKeyword: OptionalNode<Token>,
    public readonly legacyKeyword: OptionalNode<Token>,
    public readonly elementaryType: OptionalNode<ElementaryType>,
    public readonly classIdentifier: OptionalNode<Identifier>,
    public readonly relationalLessThanPunctuator: RequiredNode<Token>,
    public readonly mapIdentifier: RequiredNode<Identifier>,
    public readonly relationalGreaterThanPunctuator: RequiredNode<Token>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.MAP_DEFINITION,
      children,
    );
  }
}
