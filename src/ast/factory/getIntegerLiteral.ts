import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { getToken } from "../../util/nodeFactoryUtils.ts";
import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";

export function getIntegerLiteral(
  cursor: TreeCursor,
  text: Text,
): NumberLiteral {
  const literal = getToken(cursor, text);
  const literalText = literal.text;
  const value = parseInt(literalText, 10);

  return new NumberLiteral(
    NumberLiteralKind.INTEGER,
    value,
    [literal],
  );
}
