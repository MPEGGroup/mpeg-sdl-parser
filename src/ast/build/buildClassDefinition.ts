import { NodeKind } from "../node/enum/node_kind.ts";
import { ClassDefinition } from "../node/ClassDefinition.ts";
import type { ParameterValueList } from "../node/ParameterValueList.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { Token } from "../node/Token.ts";

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
