import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";
import type { Token } from "../node/Token.ts";

export function buildDecimalLiteral(
  token: Token,
): NumberLiteral {
  const value = parseFloat(token.text);

  return new NumberLiteral(
    NumberLiteralKind.DECIMAL,
    value,
    [token],
  );
}
