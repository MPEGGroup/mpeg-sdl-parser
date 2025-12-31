import type { AbstractExpression } from "../../../../index.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { LengthAttribute } from "../../node/length-attribute.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import type { BuildContext } from "../util/build-context.ts";

export function buildLengthAttribute(
  buildContext: BuildContext,
): LengthAttribute {
  const children: Array<AbstractNode> = [];

  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );

  children.push(openParenthesisPunctuator);

  const length = fetchRequiredNode<
    NumberLiteral | Identifier | AbstractExpression
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );

  children.push(length);

  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );

  children.push(closeParenthesisPunctuator);

  return new LengthAttribute(
    openParenthesisPunctuator,
    length,
    closeParenthesisPunctuator,
    children,
  );
}
