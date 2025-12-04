import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Identifier } from "./identifier.ts";
import type { ParameterValueList } from "./parameter-value-list.ts";
import type { Token } from "./token.ts";

export class ClassDefinition extends AbstractStatement {
  constructor(
    public readonly legacyKeyword: OptionalNode<Token>,
    public readonly classIdentifier: RequiredNode<Identifier>,
    public readonly identifier: RequiredNode<Identifier>,
    public readonly parameterValueList: OptionalNode<ParameterValueList>,
    public readonly semicolonPunctuator: RequiredNode<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      StatementKind.CLASS_DEFINITION,
      children,
    );
  }
}
