import { NodeKind } from "../node/enum/node-kind.ts";
import { ClassDefinition } from "../node/class-definition.ts";
import type { ParameterValueList } from "../node/parameter-value-list.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import type { Token } from "../node/token.ts";

export function buildClassDefinition(
  buildContext: BuildContext,
): ClassDefinition {
  const children: Array<AbstractNode> = [];

  const legacyKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.LEGACY,
  );
  if (legacyKeyword) {
    children.push(legacyKeyword);
  }

  const classIdentifier = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(classIdentifier);
  const identifier = fetchRequiredNode<Token>(
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
  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );
  children.push(semicolonPunctuator);

  return new ClassDefinition(
    legacyKeyword,
    classIdentifier,
    identifier,
    parameterValueList,
    semicolonPunctuator,
    children,
  );
}
