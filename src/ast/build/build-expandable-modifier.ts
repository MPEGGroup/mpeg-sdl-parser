import { InternalParseError } from "../../parse-error.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import { ExpandableModifier } from "../node/expandable-modifier.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildExpandableModifier(
  buildContext: BuildContext,
): ExpandableModifier {
  const children: Array<AbstractNode> = [];

  const expandableKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.EXPANDABLE,
  );
  children.push(expandableKeyword);

  const openParenthesisPunctuator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  let maxClassSize: OptionalNode<NumberLiteral> = undefined;
  let closedParenthesisPunctuator: OptionalNode<Token> = undefined;

  if (openParenthesisPunctuator) {
    children.push(openParenthesisPunctuator);
    maxClassSize = fetchOptionalNode<NumberLiteral>(
      buildContext,
      NodeKind.NUMBER_LITERAL,
    );
    if (maxClassSize) {
      children.push(maxClassSize);
    } else {
      throw new InternalParseError(
        "ExpandableModifier missing required maxClassSize NumberLiteral",
        (openParenthesisPunctuator as Token).location,
      );
    }
    closedParenthesisPunctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.CLOSE_PARENTHESIS,
    );
    if (closedParenthesisPunctuator) {
      children.push(closedParenthesisPunctuator);
    } else {
      throw new InternalParseError(
        "ExpandableModifier missing required closedParenthesisPunctuator Token",
        (openParenthesisPunctuator as Token).location,
      );
    }
  }

  return new ExpandableModifier(
    expandableKeyword,
    openParenthesisPunctuator,
    maxClassSize,
    closedParenthesisPunctuator,
    children,
  );
}
