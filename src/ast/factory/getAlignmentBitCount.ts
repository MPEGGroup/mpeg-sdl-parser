import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getToken } from "../../util/nodeFactoryUtils.ts";
import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";

export function getAlignmentBitCount(
  cursor: TreeCursor,
  text: Text,
): NumberLiteral {
  const literal = getToken(cursor, text);
  const literalText = literal.text;
  const value = parseInt(literalText, 10);

  if (![8, 16, 32, 64, 128].includes(value)) {
    throw new InternalParseError(
      `Unexpected value: ${value}`,
    );
  }

  return new NumberLiteral(
    NumberLiteralKind.INTEGER,
    value,
    [literal],
  );
}
