import type { AbstractNode } from "../node/AbstractNode.ts";
import { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import { Token } from "../node/Token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import type { BuildContext } from "./BuildContext.ts";

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
