import type { AbstractExpression } from "../node/abstract-expression.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import { ArrayElementAccess } from "../node/array-element-access.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import { Identifier } from "../node/identifier.ts";

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
