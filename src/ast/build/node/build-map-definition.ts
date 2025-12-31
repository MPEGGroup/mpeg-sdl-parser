import { Identifier } from "../../node/identifier.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import { MapDefinition } from "../../node/map-definition.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { Token } from "../../node/token.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import type { OptionalNode } from "../../util/types.ts";
import { InternalParseError } from "../../../parse-error.ts";
import type { ElementaryType } from "../../../../dist/index.js";

export function buildMapDefinition(
  buildContext: BuildContext,
): MapDefinition {
  const children: Array<AbstractNode> = [];

  const reservedKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.RESERVED,
  );
  if (reservedKeyword) {
    children.push(reservedKeyword);
  }

  const legacyKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.LEGACY,
  );
  if (legacyKeyword) {
    children.push(legacyKeyword);
  }

  const elementaryType = fetchOptionalNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );
  let classIdentifier: OptionalNode<Identifier> | undefined;

  if (elementaryType) {
    children.push(elementaryType);
  } else {
    classIdentifier = fetchOptionalNode<Identifier>(
      buildContext,
      NodeKind.IDENTIFIER,
    );
    if (classIdentifier) {
      children.push(classIdentifier);
    } else {
      throw new InternalParseError(
        "Expected either an elementary type or a class identifier in map definition",
      );
    }
  }

  const relationalLessThanPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.RELATIONAL_LESS_THAN,
  );
  children.push(relationalLessThanPunctuator);

  const mapIdentifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(mapIdentifier);

  const relationalGreaterThanPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.RELATIONAL_GREATER_THAN,
  );
  children.push(relationalGreaterThanPunctuator);

  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(identifier);

  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );
  children.push(semicolonPunctuator);

  return new MapDefinition(
    reservedKeyword,
    legacyKeyword,
    elementaryType,
    classIdentifier,
    relationalLessThanPunctuator,
    mapIdentifier,
    relationalGreaterThanPunctuator,
    identifier,
    semicolonPunctuator,
    children,
  );
}
