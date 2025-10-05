import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { ClassDeclaration } from "../node/ClassDeclaration.ts";
import { AbstractStatement } from "../node/AbstractStatement.ts";
import { BitModifier } from "../node/BitModifier.ts";
import { ExtendsModifier } from "../node/ExtendsModifier.ts";
import { ParameterList } from "../node/ParameterList.ts";
import type { ExpandableModifier } from "../node/ExpandableModifier.ts";
import type { AlignedModifier } from "../node/AlignedModifier.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getClassDeclaration(
  cursor: TreeCursor,
  text: Text,
): ClassDeclaration {
  let alignedModifier: AlignedModifier | undefined;
  let expandableModifier: ExpandableModifier | undefined;
  let identifier: Identifier | undefined;
  let parameterList: ParameterList | undefined;
  let extendsModifier: ExtendsModifier | undefined;
  let bitModifier: BitModifier | undefined;
  const statements: AbstractStatement[] = [];
  let abstractKeyword: Token | undefined;
  let classKeyword: Token | undefined;
  let openBracePunctuator: Token | undefined;
  let closeBracePunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.ALIGNED_MODIFIER:
          alignedModifier = childNodeOrToken as AlignedModifier;
          break;
        case NodeKind.EXPANDABLE_MODIFIER:
          expandableModifier = childNodeOrToken as ExpandableModifier;
          break;
        case NodeKind.IDENTIFIER:
          identifier = childNodeOrToken as Identifier;
          break;
        case NodeKind.PARAMETER_LIST:
          parameterList = childNodeOrToken as ParameterList;
          break;
        case NodeKind.EXTENDS_MODIFIER:
          extendsModifier = childNodeOrToken as ExtendsModifier;
          break;
        case NodeKind.BIT_MODIFIER:
          bitModifier = childNodeOrToken as BitModifier;
          break;
        case NodeKind.STATEMENT:
          statements.push(childNodeOrToken as AbstractStatement);
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "class":
          classKeyword = childNodeOrToken;
          break;
        case "abstract":
          abstractKeyword = childNodeOrToken;
          break;
        case "{":
          openBracePunctuator = childNodeOrToken;
          break;
        case "}":
          closeBracePunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (classKeyword === undefined) {
    throw new InternalParseError(
      "Expected argument classKeyword to be defined",
    );
  }
  if (openBracePunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument openBracePunctuator to be defined",
    );
  }
  if (closeBracePunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument closeBracePunctuator to be defined",
    );
  }
  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }
  return new ClassDeclaration(
    alignedModifier,
    expandableModifier,
    abstractKeyword !== undefined,
    identifier,
    parameterList,
    extendsModifier,
    bitModifier,
    statements,
    abstractKeyword,
    classKeyword,
    openBracePunctuator,
    closeBracePunctuator,
  );
}
