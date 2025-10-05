import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import { MapEntry } from "../node/MapEntry.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { AggregateOutputValue } from "../node/AggregateOutputValue.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getMapEntry(
  cursor: TreeCursor,
  text: Text,
): MapEntry {
  let inputValue: NumberLiteral | undefined;
  let outputValue: AggregateOutputValue | undefined;
  let commaPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.AGGREGATE_OUTPUT_VALUE:
          outputValue = childNodeOrToken as AggregateOutputValue;
          break;
        case NodeKind.NUMBER_LITERAL:
          inputValue = childNodeOrToken as NumberLiteral;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      if (childNodeOrToken.text === ",") {
        commaPunctuator = childNodeOrToken;
      } else {
        throw new InternalParseError(
          `Unexpected token: ${childNodeOrToken.text}`,
        );
      }
    }
  }

  if (inputValue === undefined) {
    throw new InternalParseError("Expected argument inputValue to be defined");
  }
  if (outputValue === undefined) {
    throw new InternalParseError("Expected argument outputValue to be defined");
  }
  if (commaPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument commaPunctuator to be defined",
    );
  }
  return new MapEntry(
    inputValue,
    outputValue,
    commaPunctuator,
  );
}
