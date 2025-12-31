import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import type { AbstractExpression } from "../../node/abstract-expression.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import { ExplicitArrayDimension } from "../../node/explicit-array-dimension.ts";
import type { BuildContext } from "../util/build-context.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import type { Token } from "../../node/token.ts";

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
