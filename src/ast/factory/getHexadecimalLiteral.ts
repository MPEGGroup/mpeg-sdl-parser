import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { getToken } from "../../util/nodeFactoryUtils.ts";
import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";
import { InternalParseError } from "../../ParseError.ts";
import { getLocationFromTextPosition } from "../../util/locationUtils.ts";

const DOT_SEPARATOR_REGEX = /\./g;

export function getHexadecimalLiteral(
  cursor: TreeCursor,
  text: Text,
): NumberLiteral {
  const literal = getToken(cursor, text);
  const literalText = literal.text;

  if (!literalText.startsWith("0x")) {
    throw new InternalParseError(
      `Missing hexadecimal literal prefix '0x': ${literalText}`,
      getLocationFromTextPosition(text, cursor.from),
    );
  }

  if (literalText.length === 2) {
    throw new InternalParseError(
      `Missing hexadecimal literal value after prefix '0x'`,
      getLocationFromTextPosition(text, cursor.from),
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
    [literal],
  );
}
