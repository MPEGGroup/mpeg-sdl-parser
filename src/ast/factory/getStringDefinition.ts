import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { StringDefinition } from "../node/StringDefinition.ts";
import { StringLiteral } from "../node/StringLiteral.ts";
import { AlignedModifier } from "../node/AlignedModifier.ts";
import { StringVariableKind } from "../node/enum/string_variable_kind.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getStringDefinition(
  cursor: TreeCursor,
  text: Text,
): StringDefinition {
  let alignedModifier: AlignedModifier | undefined;
  let stringVariableKind: StringVariableKind | undefined;
  let identifier: Identifier | undefined;
  let stringLiteral: StringLiteral | undefined;
  let reservedKeyword: Token | undefined;
  let legacyKeyword: Token | undefined;
  let constKeyword: Token | undefined;
  let stringVariableKindToken: Token | undefined;
  let assignmentPunctuator: Token | undefined;
  let semicolonPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.ALIGNED_MODIFIER:
          alignedModifier = childNodeOrToken as AlignedModifier;
          break;
        case NodeKind.IDENTIFIER:
          identifier = childNodeOrToken as Identifier;
          break;
        case NodeKind.STRING_LITERAL:
          stringLiteral = childNodeOrToken as StringLiteral;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "reserved":
          reservedKeyword = childNodeOrToken;
          break;
        case "legacy":
          legacyKeyword = childNodeOrToken;
          break;
        case "const":
          constKeyword = childNodeOrToken;
          break;
        case "utf16string":
          stringVariableKind = StringVariableKind.UTF16;
          stringVariableKindToken = childNodeOrToken;
          break;
        case "utf8string":
          stringVariableKind = StringVariableKind.UTF8;
          stringVariableKindToken = childNodeOrToken;
          break;
        case "utf8list":
          stringVariableKind = StringVariableKind.UTF8_LIST;
          stringVariableKindToken = childNodeOrToken;
          break;
        case "utfstring":
          stringVariableKind = StringVariableKind.UTF;
          stringVariableKindToken = childNodeOrToken;
          break;
        case "base64string":
          stringVariableKind = StringVariableKind.BASE64;
          stringVariableKindToken = childNodeOrToken;
          break;
        case "=":
          assignmentPunctuator = childNodeOrToken;
          break;
        case ";":
          semicolonPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }
  if (stringVariableKind === undefined) {
    throw new InternalParseError(
      "Expected argument stringVariableKind to be defined",
    );
  }
  if (stringLiteral === undefined) {
    throw new InternalParseError(
      "Expected argument stringLiteral to be defined",
    );
  }

  return new StringDefinition(
    reservedKeyword !== undefined,
    legacyKeyword !== undefined,
    constKeyword !== undefined,
    alignedModifier,
    stringVariableKind,
    identifier,
    stringLiteral,
    reservedKeyword,
    legacyKeyword,
    constKeyword,
    stringVariableKindToken!,
    assignmentPunctuator,
    semicolonPunctuator!,
  );
}
