import { InternalParseError } from "../../parse-error.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { AlignedModifier } from "../node/aligned-modifier.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import type { Token } from "../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import type { BuildContext } from "./build-context.ts";

export function buildAlignedModifier(
  buildContext: BuildContext,
): AlignedModifier {
  const children: Array<AbstractNode> = [];
  const alignedKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.ALIGNED,
  );
  children.push(alignedKeyword);

  const openParenthesisPunctuator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );

  let bitCountModifierToken: OptionalNode<Token> | undefined = undefined;
  let closeParenthesisPunctuator: OptionalNode<Token> | undefined = undefined;

  if (openParenthesisPunctuator) {
    children.push(openParenthesisPunctuator);

    bitCountModifierToken = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      [
        TokenKind.ALIGNMENT_BIT_COUNT_8,
        TokenKind.ALIGNMENT_BIT_COUNT_16,
        TokenKind.ALIGNMENT_BIT_COUNT_32,
        TokenKind.ALIGNMENT_BIT_COUNT_64,
        TokenKind.ALIGNMENT_BIT_COUNT_128,
      ],
    );
    if (bitCountModifierToken) {
      children.push(bitCountModifierToken);
    } else {
      throw new InternalParseError(
        "Expected alignment bit count modifier token after 'aligned('",
        (openParenthesisPunctuator as Token).location,
      );
    }

    closeParenthesisPunctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.CLOSE_PARENTHESIS,
    );
    if (closeParenthesisPunctuator) {
      children.push(closeParenthesisPunctuator);
    } else {
      throw new InternalParseError(
        "Expected closing parenthesis ')' after alignment bit count modifier",
        (bitCountModifierToken as Token).location,
      );
    }
  }

  return new AlignedModifier(
    alignedKeyword,
    openParenthesisPunctuator,
    bitCountModifierToken,
    closeParenthesisPunctuator,
    children,
  );
}
