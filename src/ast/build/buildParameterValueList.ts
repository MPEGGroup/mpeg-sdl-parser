import { NodeKind } from "../node/enum/node_kind.ts";
import { ParameterValueList } from "../node/ParameterValueList.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import {
  fetchOneToManyCommaSeparatedList,
  fetchRequiredNode,
} from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
