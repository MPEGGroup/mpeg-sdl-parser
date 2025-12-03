import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";
import type { Token } from "../node/Token.ts";

export function buildIntegerLiteral(
  token: Token,
): NumberLiteral {
  const value = parseInt(token.text, 10);

  return new NumberLiteral(
    NumberLiteralKind.INTEGER,
    value,
    [token],
  );
}
