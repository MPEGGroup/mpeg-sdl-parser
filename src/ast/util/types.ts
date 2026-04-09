import type { AbstractCompositeNode } from "../node/abstract-composite-node.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { AbstractStatement } from "../node/abstract-statement.ts";
import type { ComputedElementaryTypeDefinition } from "../node/computed-elementary-type-definition.ts";
import type { Identifier } from "../node/identifier.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import type { MissingError } from "../node/missing-error.ts";
import type { Token } from "../node/token.ts";
import type { UnexpectedError } from "../node/unexpected-error.ts";
import { StatementKind } from "../node/enum/statement-kind.ts";
import type { ElementaryType } from "../node/elementary-type.ts";
import type { AbstractExpression } from "../node/abstract-expression.ts";
import type { ExpandableModifier } from "../node/expandable-modifier.ts";
import type { DefaultClause } from "../node/default-clause.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import type { CaseClause } from "../node/case-clause.ts";
import type { ExtendsModifier } from "../node/extends-modifier.ts";
import type { AlignedModifier } from "../node/aligned-modifier.ts";
import type { BitModifier } from "../node/bit-modifier.ts";
import { ExpressionKind } from "../node/enum/expression-kind.ts";

export type OptionalNode<T> = T | UnexpectedError | undefined;

export type RequiredNode<T> = T | MissingError | UnexpectedError;

export type ZeroToManyList<T> = Array<T | UnexpectedError>;

export type OneToManyList<T> = Array<T | MissingError | UnexpectedError>;

export function isCompositeNode(
  node: AbstractNode | undefined,
): node is AbstractCompositeNode {
  return node?.isComposite === true;
}

export function isToken(
  node: AbstractNode | undefined,
): node is Token {
  return node?.nodeKind === NodeKind.TOKEN;
}

export function isUnexpectedError(
  node: AbstractNode | undefined,
): node is UnexpectedError {
  return node?.nodeKind === NodeKind.UNEXPECTED_ERROR;
}

export function isMissingError(
  node: AbstractNode | undefined,
): node is MissingError {
  return node?.nodeKind === NodeKind.TOKEN &&
    ((node as Token).tokenKind === TokenKind.ERROR_MISSING_TOKEN);
}

export function isStatement(
  node: AbstractNode | undefined,
): node is AbstractStatement {
  return node?.nodeKind === NodeKind.STATEMENT &&
    (Object.values(StatementKind) as number[]).includes(
      (node as AbstractStatement).statementKind,
    );
}

export function isIdentifier(
  node: AbstractNode | undefined,
): node is Identifier {
  return node?.nodeKind === NodeKind.IDENTIFIER;
}

export function isElementaryType(
  node: AbstractNode | undefined,
): node is ElementaryType {
  return node?.nodeKind === NodeKind.ELEMENTARY_TYPE;
}

export function isAbstractExpression(
  node: AbstractNode | undefined,
): node is AbstractExpression {
  return node?.nodeKind === NodeKind.EXPRESSION;
}

export function isUnaryExpression(
  node: AbstractNode | undefined,
): node is AbstractExpression {
  return (node?.nodeKind === NodeKind.EXPRESSION) &&
    (node as AbstractExpression).expressionKind === ExpressionKind.UNARY;
}

export function isNumberLiteral(
  node: AbstractNode | undefined,
): node is NumberLiteral {
  return node?.nodeKind === NodeKind.NUMBER_LITERAL;
}

export function isComputedElementaryTypeDefinition(
  node: AbstractNode | undefined,
): node is ComputedElementaryTypeDefinition {
  return node?.nodeKind === NodeKind.STATEMENT &&
    (node as AbstractStatement).statementKind ===
      StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION;
}

export function isExpandableModifier(
  node: AbstractNode | undefined,
): node is ExpandableModifier {
  return node?.nodeKind === NodeKind.EXPANDABLE_MODIFIER;
}

export function isAlignedModifier(
  node: AbstractNode | undefined,
): node is AlignedModifier {
  return node?.nodeKind === NodeKind.ALIGNED_MODIFIER;
}

export function isExtendsModifier(
  node: AbstractNode | undefined,
): node is ExtendsModifier {
  return node?.nodeKind === NodeKind.EXTENDS_MODIFIER;
}

export function isCaseClause(
  node: AbstractNode | undefined,
): node is CaseClause {
  return node?.nodeKind === NodeKind.CASE_CLAUSE;
}

export function isDefaultClause(
  node: AbstractNode | undefined,
): node is DefaultClause {
  return node?.nodeKind === NodeKind.DEFAULT_CLAUSE;
}

export function isBitModifier(
  node: AbstractNode | undefined,
): node is BitModifier {
  return node?.nodeKind === NodeKind.BIT_MODIFIER;
}
