import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { ArrayElementAccess } from "../node/ArrayElementAccess.ts";

export function getArrayElementAccess(
  cursor: TreeCursor,
  text: Text,
): ArrayElementAccess {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let index: AbstractExpression | Identifier | NumberLiteral | undefined;
  let openBracketPunctuator: Token | undefined;
  let closeBracketPunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.NUMBER_LITERAL:
          index = childNodeOrToken as NumberLiteral;
          break;
        case NodeKind.EXPRESSION:
          index = childNodeOrToken as AbstractExpression;
          break;
        case NodeKind.IDENTIFIER:
          index = childNodeOrToken as Identifier;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      if (childNodeOrToken.text === "[") {
        openBracketPunctuator = childNodeOrToken;
      } else if (childNodeOrToken.text === "]") {
        closeBracketPunctuator = childNodeOrToken;
      } else {
        throw new InternalParseError(
          `Unexpected token: ${childNodeOrToken.text}`,
        );
      }
    }
  }

  if (index === undefined) {
    throw new InternalParseError("Expected argument index to be defined");
  }

  if (openBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument openBracketPunctuator to be defined",
    );
  }

  if (closeBracketPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument closeBracketPunctuator to be defined",
    );
  }

  return new ArrayElementAccess(
    index,
    openBracketPunctuator,
    closeBracketPunctuator,
  );
}
