import { NodeKind } from "../node/enum/node_kind.ts";
import { ParameterList } from "../node/ParameterList.ts";
import type { Parameter } from "../node/Parameter.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import {
  fetchOneToManyCommaSeparatedList,
  fetchRequiredNode,
} from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildParameterList(
  buildContext: BuildContext,
): ParameterList {
  const children: Array<AbstractNode> = [];

  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);

  const { nodes: parameters, commaPunctuators } =
    fetchOneToManyCommaSeparatedList<
      Parameter
    >(buildContext, NodeKind.PARAMETER);

  // now push each output value and comma punctuator to children
  for (let i = 0; i < parameters.length; i++) {
    children.push(parameters[i]);
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
  return new ParameterList(
    openParenthesisPunctuator,
    parameters,
    commaPunctuators,
    closeParenthesisPunctuator,
    children,
  );
}
