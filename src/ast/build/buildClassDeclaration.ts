import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { ClassDeclaration } from "../node/ClassDeclaration.ts";
import { AbstractStatement } from "../node/AbstractStatement.ts";
import { BitModifier } from "../node/BitModifier.ts";
import { ExtendsModifier } from "../node/ExtendsModifier.ts";
import { ParameterList } from "../node/ParameterList.ts";
import type { ExpandableModifier } from "../node/ExpandableModifier.ts";
import type { AlignedModifier } from "../node/AlignedModifier.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";

export function buildClassDeclaration(
  buildContext: BuildContext,
): ClassDeclaration {
  const children: Array<AbstractNode> = [];
  const alignedModifier = fetchOptionalNode<AlignedModifier>(
    buildContext,
    NodeKind.ALIGNED_MODIFIER,
  );
  if (alignedModifier) {
    children.push(alignedModifier);
  }

  const expandableModifier = fetchOptionalNode<ExpandableModifier>(
    buildContext,
    NodeKind.EXPANDABLE_MODIFIER,
  );
  if (expandableModifier) {
    children.push(expandableModifier);
  }

  const abstractKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.ABSTRACT,
  );

  if (abstractKeyword) {
    children.push(abstractKeyword);
  }
  const classKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLASS,
  );

  children.push(classKeyword);

  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );

  children.push(identifier);

  const parameterList = fetchOptionalNode<ParameterList>(
    buildContext,
    NodeKind.PARAMETER_LIST,
  );

  if (parameterList) {
    children.push(parameterList);
  }
  const extendsModifier = fetchOptionalNode<ExtendsModifier>(
    buildContext,
    NodeKind.EXTENDS_MODIFIER,
  );

  if (extendsModifier) {
    children.push(extendsModifier);
  }
  const bitModifier = fetchOptionalNode<BitModifier>(
    buildContext,
    NodeKind.BIT_MODIFIER,
  );

  if (bitModifier) {
    children.push(bitModifier);
  }
  const openBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );

  children.push(openBracePunctuator);

  const statements = fetchZeroToManyList<AbstractStatement>(
    buildContext,
    NodeKind.STATEMENT,
  );

  children.push(...statements);

  const closeBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACE,
  );
  children.push(closeBracePunctuator);

  return new ClassDeclaration(
    alignedModifier,
    expandableModifier,
    abstractKeyword,
    classKeyword,
    identifier,
    parameterList,
    extendsModifier,
    bitModifier,
    openBracePunctuator,
    statements,
    closeBracePunctuator,
    children,
  );
}
