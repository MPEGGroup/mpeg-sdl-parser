import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { MapDeclaration } from "../node/MapDeclaration.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import type { MapEntry } from "../node/MapEntry.ts";

export function getMapDeclaration(
  cursor: TreeCursor,
  text: Text,
): MapDeclaration {
  let identifier: Identifier | undefined;
  let outputElementaryType: ElementaryType | undefined;
  let outputClassIdentifier: Identifier | undefined;
  const mapEntries: MapEntry[] = [];
  let mapKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closeParenthesisPunctuator: Token | undefined;
  let openBracePunctuator: Token | undefined;
  let commaPunctuators: Token[] | undefined;
  let closeBracePunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          if (identifier === undefined) {
            identifier = childNodeOrToken as Identifier;
          } else {
            outputClassIdentifier = childNodeOrToken as Identifier;
          }
          break;
        case NodeKind.MAP_ENTRY:
          mapEntries.push(childNodeOrToken as MapEntry);
          break;
        case NodeKind.ELEMENTARY_TYPE:
          outputElementaryType = childNodeOrToken as ElementaryType;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "map":
          mapKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ")":
          closeParenthesisPunctuator = childNodeOrToken;
          break;
        case "{":
          openBracePunctuator = childNodeOrToken;
          break;
        case ",":
          if (commaPunctuators === undefined) {
            commaPunctuators = [];
          }
          commaPunctuators.push(childNodeOrToken);
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

  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }
  if (mapKeyword === undefined) {
    throw new InternalParseError(
      "Expected argument mapKeyword to be defined",
    );
  }
  if (openParenthesisPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument openParenthesisPunctuator to be defined",
    );
  }
  if (closeParenthesisPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument closeParenthesisPunctuator to be defined",
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
  return new MapDeclaration(
    identifier!,
    outputElementaryType,
    outputClassIdentifier,
    mapEntries,
    mapKeyword!,
    openParenthesisPunctuator,
    closeParenthesisPunctuator,
    openBracePunctuator,
    commaPunctuators,
    closeBracePunctuator,
  );
}
