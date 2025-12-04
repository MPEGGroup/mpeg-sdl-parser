import { NumberLiteral } from "../node/number-literal.ts";
import { NumberLiteralKind } from "../node/enum/number-literal-kind.ts";
import { InternalParseError } from "../../parse-error.ts";
import type { Token } from "../node/token.ts";

const DOT_SEPARATOR_REGEX = /\./g;

export function buildHexadecimalLiteral(
  token: Token,
): NumberLiteral {
  const literalText = token.text;

  if (!literalText.startsWith("0x")) {
    throw new InternalParseError(
      `Missing hexadecimal literal prefix '0x': ${literalText}`,
      token.location,
    );
  }

  if (literalText.length === 2) {
    throw new InternalParseError(
      `Missing hexadecimal literal value after prefix '0x'`,
      token.location,
    );
  }

  const stringValue = literalText.substring(2).trim().replaceAll(
    DOT_SEPARATOR_REGEX,
    "",
  );
  const value = parseInt(stringValue, 16);

  return new NumberLiteral(
    NumberLiteralKind.HEXADECIMAL,
    value,
    [token],
  );
}
