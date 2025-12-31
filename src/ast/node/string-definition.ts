import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { AlignedModifier } from "./aligned-modifier.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { StringLiteral } from "./string-literal.ts";
import type { Token } from "./token.ts";

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
