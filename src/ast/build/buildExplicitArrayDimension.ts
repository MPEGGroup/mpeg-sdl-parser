import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { ExplicitArrayDimension } from "../node/ExplicitArrayDimension.ts";
import type { BuildContext } from "./BuildContext.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import type { Token } from "../node/Token.ts";

export function buildExplicitArrayDimension(
  buildContext: BuildContext,
): ExplicitArrayDimension {
  const openBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACKET,
  );
  const size = fetchRequiredNode<
    AbstractExpression | Identifier | NumberLiteral
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  const closeBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACKET,
  );

  return new ExplicitArrayDimension(
    openBracketPunctuator,
    size,
    closeBracketPunctuator,
    [openBracketPunctuator, size, closeBracketPunctuator!],
  );
}
