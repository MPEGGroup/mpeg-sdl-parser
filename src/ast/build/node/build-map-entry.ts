import { NodeKind } from "../../node/enum/node-kind.ts";
import { MapEntry } from "../../node/map-entry.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import type { AggregateOutputValue } from "../../node/aggregate-output-value.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

export function buildMapEntry(
  buildContext: BuildContext,
): MapEntry {
  const inputValue = fetchRequiredNode<NumberLiteral>(
    buildContext,
    NodeKind.NUMBER_LITERAL,
  );
  const commaPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.COMMA,
  );
  const outputValue = fetchRequiredNode<AggregateOutputValue>(
    buildContext,
    NodeKind.AGGREGATE_OUTPUT_VALUE,
  );

  return new MapEntry(
    inputValue,
    commaPunctuator,
    outputValue,
    [inputValue, commaPunctuator, outputValue],
  );
}
