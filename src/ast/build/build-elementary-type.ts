import type { AbstractNode } from "../node/abstract-node.ts";
import { ElementaryType } from "../node/elementary-type.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import { Token } from "../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { BuildContext } from "./build-context.ts";

export function buildElementaryType(
  buildContext: BuildContext,
): ElementaryType {
  const children: Array<AbstractNode> = [];
  const unsignedQualifierKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.UNSIGNED,
  );

  if (unsignedQualifierKeyword) {
    children.push(unsignedQualifierKeyword);
  }

  const typeKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    [TokenKind.INT, TokenKind.BIT, TokenKind.FLOAT],
  );

  children.push(typeKeyword);

  return new ElementaryType(
    unsignedQualifierKeyword,
    typeKeyword,
    children,
  );
}
