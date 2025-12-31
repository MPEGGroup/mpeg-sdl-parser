import { NumberLiteral } from "../../node/number-literal.ts";
import { NumberLiteralKind } from "../../node/enum/number-literal-kind.ts";
import type { Token } from "../../node/token.ts";

export function buildFloatingPointLiteral(
  token: Token,
): NumberLiteral {
  const value = parseFloat(token.text);

  return new NumberLiteral(
    NumberLiteralKind.FLOATING_POINT,
    value,
    [token],
  );
}
