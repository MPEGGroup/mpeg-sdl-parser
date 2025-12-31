import type { OptionalNode, RequiredNode } from "../util/types.ts";
import type { AbstractExpression } from "./abstract-expression.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { AbstractStatement } from "./abstract-statement.ts";
import type { ComputedElementaryTypeDefinition } from "./computed-elementary-type-definition.ts";
import { StatementKind } from "./enum/statement-kind.ts";
import type { Token } from "./token.ts";

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
