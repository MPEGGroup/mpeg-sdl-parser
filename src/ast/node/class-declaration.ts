import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { AlignedModifier } from "./aligned-modifier.ts";
import type { BitModifier } from "./bit-modifier.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { ExpandableModifier } from "./expandable-modifier.ts";
import type { ExtendsModifier } from "./extends-modifier.ts";
import type { Identifier } from "./identifier.ts";
import type { ParameterList } from "./parameter-list.ts";
import type { Token } from "./token.ts";

export class ClassDeclaration extends AbstractStatement {
  constructor(
    public readonly alignedModifier: OptionalNode<AlignedModifier>,
    public readonly expandableModifier:
      | OptionalNode<ExpandableModifier>
      | undefined,
    public readonly abstractKeyword: OptionalNode<Token>,
    public readonly classKeyword: RequiredNode<Token>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly parameterList: OptionalNode<ParameterList>,
    public readonly extendsModifier: OptionalNode<ExtendsModifier>,
    public readonly bitModifier: OptionalNode<BitModifier>,
    public readonly openBracePunctuator: RequiredNode<Token>,
    public readonly statements: ZeroToManyList<AbstractStatement>,
    public readonly closeBracePunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.CLASS_DECLARATION,
      children,
    );
  }
}
