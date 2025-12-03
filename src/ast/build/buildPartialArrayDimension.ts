import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { PartialArrayDimension } from "../node/PartialArrayDimension.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildPartialArrayDimension(
  buildContext: BuildContext,
): PartialArrayDimension {
  const openBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACKET,
  );
  const innerOpenBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACKET,
  );
  const index = fetchRequiredNode<
    AbstractExpression | Identifier | NumberLiteral
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  const innerCloseBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACKET,
  );
  const closeBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACKET,
  );

  return new PartialArrayDimension(
    openBracketPunctuator,
    innerOpenBracketPunctuator,
    index,
    innerCloseBracketPunctuator,
    closeBracketPunctuator,
    [
      openBracketPunctuator,
      innerOpenBracketPunctuator,
      index,
      innerCloseBracketPunctuator,
      closeBracketPunctuator,
    ],
  );
}
