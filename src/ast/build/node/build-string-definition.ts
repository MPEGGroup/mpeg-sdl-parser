import { InternalParseError } from "../../../parse-error.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { StringDefinition } from "../../node/string-definition.ts";
import { StringLiteral } from "../../node/string-literal.ts";
import { AlignedModifier } from "../../node/aligned-modifier.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../../util/types.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

export function buildStringDefinition(
  buildContext: BuildContext,
): StringDefinition {
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
  const constKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CONST,
  );
  if (constKeyword) {
    children.push(constKeyword);
  }
  const alignedModifier = fetchOptionalNode<AlignedModifier>(
    buildContext,
    NodeKind.ALIGNED_MODIFIER,
  );
  if (alignedModifier) {
    children.push(alignedModifier);
  }
  const stringVariableKindToken = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    [
      TokenKind.UTF16_STRING,
      TokenKind.UTF8_STRING,
      TokenKind.UTF8_LIST,
      TokenKind.BASE64_STRING,
    ],
  );
  children.push(stringVariableKindToken);
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(identifier);
  const assignmentPunctuator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.ASSIGNMENT,
  );
  let stringLiteral: OptionalNode<StringLiteral> = undefined;
  if (assignmentPunctuator) {
    children.push(assignmentPunctuator);
    stringLiteral = fetchOptionalNode<StringLiteral>(
      buildContext,
      NodeKind.STRING_LITERAL,
    );
    if (stringLiteral) {
      children.push(stringLiteral);
    } else {
      throw new InternalParseError(
        "Expected string literal after assignment operator in string definition",
        (assignmentPunctuator as Token).location,
      );
    }
  }
  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );
  children.push(semicolonPunctuator);

  return new StringDefinition(
    reservedKeyword,
    legacyKeyword,
    constKeyword,
    alignedModifier,
    stringVariableKindToken,
    identifier,
    assignmentPunctuator,
    stringLiteral,
    semicolonPunctuator,
    children,
  );
}
