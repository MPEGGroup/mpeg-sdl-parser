import { NodeKind } from "../../node/enum/node-kind.ts";
import { ParameterValueList } from "../../node/parameter-value-list.ts";
import type { AbstractExpression } from "../../node/abstract-expression.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import {
  fetchOneToManyCommaSeparatedList,
  fetchRequiredNode,
} from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

export function buildParameterValueList(
  buildContext: BuildContext,
): ParameterValueList {
  const children: Array<AbstractNode> = [];

  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);

  const { nodes: values, commaPunctuators } = fetchOneToManyCommaSeparatedList<
    AbstractExpression
  >(buildContext, [
    NodeKind.EXPRESSION,
    NodeKind.IDENTIFIER,
    NodeKind.NUMBER_LITERAL,
  ]);

  // now push each output value and comma punctuator to children
  for (let i = 0; i < values.length; i++) {
    children.push(values[i]);
    if (i < commaPunctuators.length) {
      children.push(commaPunctuators[i]);
    }
  }

  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  children.push(closeParenthesisPunctuator);
  return new ParameterValueList(
    openParenthesisPunctuator,
    values,
    commaPunctuators,
    closeParenthesisPunctuator,
    children,
  );
}
