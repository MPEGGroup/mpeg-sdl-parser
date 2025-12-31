import { NumberLiteral } from "../../node/number-literal.ts";
import { NumberLiteralKind } from "../../node/enum/number-literal-kind.ts";
import { InternalParseError } from "../../../parse-error.ts";
import type { Token } from "../../node/token.ts";

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
