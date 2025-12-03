import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { AlignedModifier } from "./AlignedModifier.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { StringLiteral } from "./StringLiteral.ts";
import type { Token } from "./Token.ts";

export class StringDefinition extends AbstractStatement {
  constructor(
    public readonly reservedKeyword: OptionalNode<Token>,
    public readonly legacyKeyword: OptionalNode<Token>,
    public readonly constKeyword: OptionalNode<Token>,
    public readonly alignedModifier: OptionalNode<AlignedModifier>,
    public readonly stringVariableKindToken: RequiredNode<Token>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly assignmentPunctuator: OptionalNode<Token>,
    public readonly stringLiteral: OptionalNode<StringLiteral>,
    public readonly semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.STRING_DEFINITION,
      children,
    );
  }
}
