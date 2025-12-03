import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Identifier } from "./Identifier.ts";
import type { ParameterValueList } from "./ParameterValueList.ts";
import type { Token } from "./Token.ts";

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
