import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { ArrayElementAccess } from "../node/ArrayElementAccess.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import { Identifier } from "../node/Identifier.ts";

export function buildArrayElementAccess(
  buildContext: BuildContext,
): ArrayElementAccess {
  const children: Array<AbstractNode> = [];

  const openBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACKET,
  );
  children.push(openBracketPunctuator);

  const index = fetchRequiredNode<
    AbstractExpression | Identifier | NumberLiteral
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(index);

  const closeBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACKET,
  );
  children.push(closeBracketPunctuator);

  return new ArrayElementAccess(
    openBracketPunctuator,
    index,
    closeBracketPunctuator,
    children,
  );
}
