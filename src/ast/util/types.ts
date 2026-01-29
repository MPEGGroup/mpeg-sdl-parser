import type { AbstractCompositeNode } from "../node/abstract-composite-node.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { AbstractStatement } from "../node/abstract-statement.ts";
import type { Identifier } from "../node/identifier.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import type { MissingError } from "../node/missing-error.ts";
import type { Token } from "../node/token.ts";
import type { UnexpectedError } from "../node/unexpected-error.ts";
import { StatementKind } from "../node/enum/statement-kind.ts";
import type { ElementaryType } from "../node/elementary-type.ts";

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
