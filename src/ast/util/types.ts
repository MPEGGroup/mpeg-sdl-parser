import { StatementKind } from "../../../index.ts";
import type { AbstractCompositeNode } from "../node/AbstractCompositeNode.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { MissingError } from "../node/MissingError.ts";
import type { Token } from "../node/Token.ts";
import type { UnexpectedError } from "../node/UnexpectedError.ts";

export type OptionalNode<T> = T | UnexpectedError | undefined;

export type RequiredNode<T> = T | MissingError | UnexpectedError;

export type ZeroToManyList<T> = Array<T | UnexpectedError>;

export type OneToManyList<T> = Array<T | MissingError | UnexpectedError>;

export function isCompositeNode(
  node: AbstractNode,
): node is AbstractCompositeNode {
  return node?.isComposite === true;
}

export function isToken(
  node: AbstractNode,
): node is Token {
  return node?.nodeKind === NodeKind.TOKEN;
}

export function isUnexpectedError(
  node: AbstractNode,
): node is UnexpectedError {
  return node?.nodeKind === NodeKind.UNEXPECTED_ERROR;
}

export function isMissingError(
  node: AbstractNode,
): node is MissingError {
  return node?.nodeKind === NodeKind.MISSING_ERROR;
}

export function isStatement(
  node: AbstractNode,
): node is AbstractStatement {
  return node?.nodeKind in StatementKind;
}
