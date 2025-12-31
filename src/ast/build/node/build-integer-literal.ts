import { NumberLiteral } from "../../node/number-literal.ts";
import { NumberLiteralKind } from "../../node/enum/number-literal-kind.ts";
import type { Token } from "../../node/token.ts";

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
