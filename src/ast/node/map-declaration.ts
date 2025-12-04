import type {
  OneToManyList,
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { ElementaryType } from "./elementary-type.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { MapEntry } from "./map-entry.ts";
import type { Token } from "./token.ts";

export class MapDeclaration extends AbstractStatement {
  constructor(
    public readonly mapKeyword: RequiredNode<Token>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    public readonly outputElementaryType: OptionalNode<ElementaryType>,
    public readonly outputClassIdentifier: OptionalNode<Identifier>,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    public readonly openBracePunctuator: RequiredNode<Token>,
    public readonly mapEntries: OneToManyList<MapEntry>,
    public readonly commaPunctuators: ZeroToManyList<Token>,
    public readonly closeBracePunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.MAP_DECLARATION,
      children,
    );
  }
}
