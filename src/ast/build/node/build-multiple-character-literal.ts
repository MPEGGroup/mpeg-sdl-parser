import { NumberLiteral } from "../../node/number-literal.ts";
import { NumberLiteralKind } from "../../node/enum/number-literal-kind.ts";
import { InternalParseError } from "../../../parse-error.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchOneToManyList } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import { isToken } from "../../util/types.ts";

const ESCAPED_BACKSLASH_REGEX = /\\\\/g;
const ESCAPED_SINGLE_QUOTE_REGEX = /\\'/g;
const MAXIMUM_MULTIPLE_CHARACTER_LITERAL_LENGTH = 10;

function parseUnsignedIntFromMultipleCharacterLiteral(literal: string): number {
  if (literal.length > MAXIMUM_MULTIPLE_CHARACTER_LITERAL_LENGTH) {
    throw new InternalParseError(
      `Multiple character number literal exceeds maximum length of ${MAXIMUM_MULTIPLE_CHARACTER_LITERAL_LENGTH}: ${literal}`,
    );
  }

  let value = 0;
  for (let i = 0; i < literal.length; i++) {
    const charCode = literal.charCodeAt(i);
    if (charCode < 0x20 || charCode > 0x7E) {
      throw new InternalParseError(
        `Invalid character ${
          literal.charCodeAt(i)
        } in multiple character number literal: ${literal}`,
      );
    }

    value = (value << 8) + charCode;
  }

  return value;
}

export function buildMultipleCharacterLiteral(
  buildContext: BuildContext,
): NumberLiteral {
  const literals = fetchOneToManyList<Token>(
    buildContext,
    NodeKind.TOKEN,
    [TokenKind.SINGLE_QUOTE, TokenKind.MULTIPLE_CHARACTER_LITERAL_CHARACTERS],
  );

  const literalText = literals
    .filter((token) =>
      isToken(token) &&
      (token.tokenKind === TokenKind.MULTIPLE_CHARACTER_LITERAL_CHARACTERS)
    )
    .map((token) =>
      (token as Token).text.replaceAll(ESCAPED_SINGLE_QUOTE_REGEX, "'")
        .replaceAll(ESCAPED_BACKSLASH_REGEX, "\\")
    ).join("");

  const value = parseUnsignedIntFromMultipleCharacterLiteral(literalText);

  return new NumberLiteral(
    NumberLiteralKind.MULTIPLE_CHARACTER,
    value,
    literals,
  );
}
