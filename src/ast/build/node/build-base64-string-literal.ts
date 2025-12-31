import { NodeKind } from "../../node/enum/node-kind.ts";
import { StringLiteral } from "../../node/string-literal.ts";
import { StringLiteralKind } from "../../node/enum/string-literal-kind.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchOneToManyList } from "../util/fetch-node.ts";
import { isToken } from "../../util/types.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

const ESCAPED_BACKSLASH_REGEX = /\\\\/g;
const ESCAPED_DOUBLE_QUOTE_REGEX = /\\"/g;

export function buildBase64StringLiteral(
  buildContext: BuildContext,
): StringLiteral {
  const literals = fetchOneToManyList<Token>(
    buildContext,
    NodeKind.TOKEN,
    [TokenKind.DOUBLE_QUOTE, TokenKind.BASE64_STRING_LITERAL_CHARACTERS],
  );

  let value = "";

  for (const literal of literals) {
    if (
      isToken(literal) &&
      (literal.tokenKind === TokenKind.BASE64_STRING_LITERAL_CHARACTERS)
    ) {
      value += literal.text;
    }
  }
  value = value.replaceAll(ESCAPED_DOUBLE_QUOTE_REGEX, "'")
    .replaceAll(ESCAPED_BACKSLASH_REGEX, "\\");

  return new StringLiteral(
    StringLiteralKind.BASIC,
    value,
    literals,
    [...literals],
  );
}
