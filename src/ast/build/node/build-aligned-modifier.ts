import { InternalScannerError } from "../../../scanner-error.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import { AlignedModifier } from "../../node/aligned-modifier.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import type { Token } from "../../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import { isToken, type OptionalNode } from "../../util/types.ts";
import type { BuildContext } from "../util/build-context.ts";

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

  let alignment = 8;

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

      if (isToken(bitCountModifierToken)) {
        switch (bitCountModifierToken.tokenKind) {
          case TokenKind.ALIGNMENT_BIT_COUNT_8:
            alignment = 8;
            break;
          case TokenKind.ALIGNMENT_BIT_COUNT_16:
            alignment = 16;
            break;
          case TokenKind.ALIGNMENT_BIT_COUNT_32:
            alignment = 32;
            break;
          case TokenKind.ALIGNMENT_BIT_COUNT_64:
            alignment = 64;
            break;
          case TokenKind.ALIGNMENT_BIT_COUNT_128:
            alignment = 128;
            break;
        }
      }
    } else {
      throw new InternalScannerError(
        "Expected alignment bit count modifier token after 'aligned('",
        (openParenthesisPunctuator as Token).getLocation(),
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
      throw new InternalScannerError(
        "Expected closing parenthesis ')' after alignment bit count modifier",
        (bitCountModifierToken as Token).getLocation(),
      );
    }
  }

  return new AlignedModifier(
    alignedKeyword,
    openParenthesisPunctuator,
    bitCountModifierToken,
    closeParenthesisPunctuator,
    alignment,
    children,
  );
}
