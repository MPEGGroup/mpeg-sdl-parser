import type {
  OneToManyList,
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { ElementaryType } from "./ElementaryType.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { MapEntry } from "./MapEntry.ts";
import type { Token } from "./Token.ts";

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
