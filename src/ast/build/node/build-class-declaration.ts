import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { ClassDeclaration } from "../../node/class-declaration.ts";
import { AbstractStatement } from "../../node/abstract-statement.ts";
import { BitModifier } from "../../node/bit-modifier.ts";
import { ExtendsModifier } from "../../node/extends-modifier.ts";
import { ParameterList } from "../../node/parameter-list.ts";
import type { ExpandableModifier } from "../../node/expandable-modifier.ts";
import type { AlignedModifier } from "../../node/aligned-modifier.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";

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
