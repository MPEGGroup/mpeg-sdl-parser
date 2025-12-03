import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";
import { InternalParseError } from "../../ParseError.ts";
import type { Token } from "../node/Token.ts";

const DOT_SEPARATOR_REGEX = /\./g;
export function buildBinaryLiteral(
  token: Token,
): NumberLiteral {
  const literalText = token.text;

  if (!literalText.startsWith("0b")) {
    throw new InternalParseError(
      `Missing binary literal prefix '0b': ${literalText}`,
      token.location,
    );
  }

  if (literalText.length === 2) {
    throw new InternalParseError(
      `Missing binary literal value after prefix '0b'`,
      token.location,
    );
  }

  const stringValue = literalText.substring(2).trim().replaceAll(
    DOT_SEPARATOR_REGEX,
    "",
  );
  const value = parseInt(stringValue, 2);

  return new NumberLiteral(
    NumberLiteralKind.BINARY,
    value,
    [token],
  );
}
