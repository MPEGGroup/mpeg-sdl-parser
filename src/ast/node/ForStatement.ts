import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./AbstractExpression.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { AbstractStatement } from "./AbstractStatement.ts";
import type { ComputedElementaryTypeDefinition } from "./ComputedElementaryTypeDefinition.ts";
import { StatementKind } from "./enum/statement_kind.ts";
import type { Token } from "./Token.ts";

export class ForStatement extends AbstractStatement {
  constructor(
    public readonly forKeyword: RequiredNode<Token>,
    public readonly openParenthesisPunctuator: RequiredNode<Token>,
    // either ((assignment_expression semicolon) | computed_elementary_type_definition | semicolon)
    public readonly expression1: OptionalNode<AbstractExpression>,
    public readonly computedElementaryDefinition: OptionalNode<
      ComputedElementaryTypeDefinition
    >,
    // optional as the first semicolon can be considered part of the optional computedElementaryDefinition
    public readonly semicolon1Punctuator: OptionalNode<Token>,
    public readonly expression2: OptionalNode<AbstractExpression>,
    public readonly semicolon2Punctuator: RequiredNode<Token>,
    public readonly expression3: OptionalNode<AbstractExpression>,
    public readonly closeParenthesisPunctuator: RequiredNode<Token>,
    public readonly statement: RequiredNode<AbstractStatement>,
    children: Array<AbstractNode>,
  ) {
    super(StatementKind.FOR, children);
  }
}
