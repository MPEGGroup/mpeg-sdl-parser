import { NodeKind } from "../node/enum/node-kind.ts";
import { AggregateOutputValue } from "../node/aggregate-output-value.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import type { ElementaryTypeOutputValue } from "../node/elementary-type-output-value.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import {
  fetchOneToManyCommaSeparatedList,
  fetchRequiredNode,
} from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildAggregateOutputValue(
  buildContext: BuildContext,
): AggregateOutputValue {
  const children: Array<AbstractNode> = [];

  const openBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  children.push(openBracePunctuator);

  const { nodes: outputValues, commaPunctuators } =
    fetchOneToManyCommaSeparatedList<
      AggregateOutputValue | ElementaryTypeOutputValue | NumberLiteral
    >(buildContext, [
      NodeKind.AGGREGATE_OUTPUT_VALUE,
      NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE,
      NodeKind.NUMBER_LITERAL,
    ]);

  // now push each output value and comma punctuator to children
  for (let i = 0; i < outputValues.length; i++) {
    children.push(outputValues[i]);
    if (i < commaPunctuators.length) {
      children.push(commaPunctuators[i]);
    }
  }

  const closeBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACE,
  );
  children.push(closeBracePunctuator);

  return new AggregateOutputValue(
    openBracePunctuator,
    outputValues,
    commaPunctuators,
    closeBracePunctuator,
    children,
  );
}
