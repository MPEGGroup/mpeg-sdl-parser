import type { AbstractExpression } from "../../../index.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { LengthAttribute } from "../node/LengthAttribute.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import type { BuildContext } from "./BuildContext.ts";

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
