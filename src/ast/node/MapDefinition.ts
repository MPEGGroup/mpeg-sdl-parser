import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { Token } from "./Token.ts";

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
