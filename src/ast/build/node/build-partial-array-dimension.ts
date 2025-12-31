import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import type { AbstractExpression } from "../../node/abstract-expression.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import { PartialArrayDimension } from "../../node/partial-array-dimension.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

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
