import { InternalParseError } from "../../../parse-error.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { MapDeclaration } from "../../node/map-declaration.ts";
import type { ElementaryType } from "../../node/elementary-type.ts";
import type { MapEntry } from "../../node/map-entry.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import {
  fetchOneToManyCommaSeparatedList,
  fetchOptionalNode,
  fetchRequiredNode,
} from "../util/fetch-node.ts";
import type { OptionalNode } from "../../util/types.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

export function buildMapDeclaration(
  buildContext: BuildContext,
): MapDeclaration {
  const children: Array<AbstractNode> = [];

  const mapKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.MAP,
  );
  children.push(mapKeyword);
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(identifier);

  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);

  const outputElementaryType = fetchOptionalNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );
  let outputClassIdentifier: OptionalNode<Identifier> = undefined;
  if (outputElementaryType) {
    children.push(outputElementaryType);
  } else {
    outputClassIdentifier = fetchOptionalNode<Identifier>(
      buildContext,
      NodeKind.IDENTIFIER,
    );
    if (outputClassIdentifier) {
      children.push(outputClassIdentifier);
    } else {
      throw new InternalParseError(
        "MapDeclaration must have either an output elementary type or an output class identifier.",
      );
    }
  }

  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  children.push(closeParenthesisPunctuator);

  const openBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  children.push(openBracePunctuator);
  const { nodes: mapEntries, commaPunctuators } =
    fetchOneToManyCommaSeparatedList<MapEntry>(
      buildContext,
      NodeKind.MAP_ENTRY,
    );

  // now push each output value and comma punctuator to children
  for (let i = 0; i < mapEntries.length; i++) {
    children.push(mapEntries[i]);
    if (i < commaPunctuators.length) {
      children.push(commaPunctuators[i]);
    }
  }

  const closeBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACE,
  );
  children.push(closeBracePunctuator);

  return new MapDeclaration(
    mapKeyword,
    identifier,
    openParenthesisPunctuator,
    outputElementaryType,
    outputClassIdentifier,
    closeParenthesisPunctuator,
    openBracePunctuator,
    mapEntries,
    commaPunctuators,
    closeBracePunctuator,
    children,
  );
}
