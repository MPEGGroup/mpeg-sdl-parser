import { NodeKind } from "../../node/enum/node-kind.ts";
import { ExtendsModifier } from "../../node/extends-modifier.ts";
import type { Identifier } from "../../node/identifier.ts";
import type { ParameterValueList } from "../../node/parameter-value-list.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

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
