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
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { ExplicitArrayDimension } from "../node/ExplicitArrayDimension.ts";

export function getExplicitArrayDimension(
  cursor: TreeCursor,
  text: Text,
): ExplicitArrayDimension {
  let size: AbstractExpression | Identifier | NumberLiteral | undefined;
  let openBracketPunctuator: Token | undefined;
  let closeBracketPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          size = childNodeOrToken as Identifier;
          break;
        case NodeKind.NUMBER_LITERAL:
          size = childNodeOrToken as NumberLiteral;
          break;
        case NodeKind.EXPRESSION:
          size = childNodeOrToken as AbstractExpression;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "[":
          openBracketPunctuator = childNodeOrToken;
          break;
        case "]":
          closeBracketPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (size === undefined) {
    throw new InternalParseError("Expected size to be defined");
  }
  if (openBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected openBracketPunctuator to be defined",
    );
  }
  if (closeBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected closeBracketPunctuator to be defined",
    );
  }
  return new ExplicitArrayDimension(
    size,
    openBracketPunctuator,
    closeBracketPunctuator,
  );
}
