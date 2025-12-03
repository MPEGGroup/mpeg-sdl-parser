import { NodeKind } from "../node/enum/node_kind.ts";
import { ExtendsModifier } from "../node/ExtendsModifier.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { ParameterValueList } from "../node/ParameterValueList.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildExtendsModifier(
  buildContext: BuildContext,
): ExtendsModifier {
  const children: Array<AbstractNode> = [];

  const extendsKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.EXTENDS,
  );
  children.push(extendsKeyword);
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(identifier);
  const parameterValueList = fetchOptionalNode<ParameterValueList>(
    buildContext,
    NodeKind.PARAMETER_VALUE_LIST,
  );
  if (parameterValueList) {
    children.push(parameterValueList);
  }

  return new ExtendsModifier(
    extendsKeyword,
    identifier,
    parameterValueList,
    children,
  );
}
