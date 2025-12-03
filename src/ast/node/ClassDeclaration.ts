import type {
  OptionalNode,
  RequiredNode,
  ZeroToManyList,
} from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { AlignedModifier } from "./AlignedModifier.ts";
import type { BitModifier } from "./BitModifier.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { ExpandableModifier } from "./ExpandableModifier.ts";
import type { ExtendsModifier } from "./ExtendsModifier.ts";
import type { Identifier } from "./Identifier.ts";
import type { ParameterList } from "./ParameterList.ts";
import type { Token } from "./Token.ts";

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
