import { InternalParseError } from "../../parse-error.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import { BitModifier } from "../node/bit-modifier.ts";
import type { Identifier } from "../node/identifier.ts";
import type { AbstractClassId } from "../node/abstract-class-id.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildBitModifier(
  buildContext: BuildContext,
): BitModifier {
  const children: Array<AbstractNode> = [];

  const colonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.COLON,
  );
  children.push(colonPunctuator);
  const bitKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.BIT,
  );
  children.push(bitKeyword);
  const openParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_PARENTHESIS,
  );
  children.push(openParenthesisPunctuator);
  const length = fetchRequiredNode<NumberLiteral>(
    buildContext,
    NodeKind.NUMBER_LITERAL,
  );
  children.push(length);
  const closeParenthesisPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_PARENTHESIS,
  );
  children.push(closeParenthesisPunctuator);
  const identifier = fetchOptionalNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );

  let assignmentOperator: OptionalNode<Token> = undefined;
  if (identifier) {
    children.push(identifier);
    assignmentOperator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.ASSIGNMENT,
    );
    if (assignmentOperator) {
      children.push(assignmentOperator);
    } else {
      throw new InternalParseError(
        "Expected assignment operator '=' after bit modifier identifier.",
      );
    }
  }
  const classId = fetchRequiredNode<AbstractClassId>(
    buildContext,
    NodeKind.CLASS_ID,
  );
  children.push(classId);

  return new BitModifier(
    colonPunctuator,
    bitKeyword,
    openParenthesisPunctuator,
    length,
    closeParenthesisPunctuator,
    identifier,
    assignmentOperator,
    classId,
    children,
  );
}
