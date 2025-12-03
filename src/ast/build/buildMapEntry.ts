import { NodeKind } from "../node/enum/node_kind.ts";
import { MapEntry } from "../node/MapEntry.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { AggregateOutputValue } from "../node/AggregateOutputValue.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
