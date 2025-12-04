import { NumberLiteral } from "../node/number-literal.ts";
import { NumberLiteralKind } from "../node/enum/number-literal-kind.ts";
import type { Token } from "../node/token.ts";

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
