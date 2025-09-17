import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";

export function getCompoundStatement(
  cursor: TreeCursor,
  text: Text,
): CompoundStatement {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  const statements: AbstractStatement[] = [];
  let openBracePunctuator: Token | undefined;
  let closeBracePunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind === NodeKind.STATEMENT) {
        statements.push(childNodeOrToken as AbstractStatement);
      } else {
        throw new InternalParseError(
          `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
        );
      }
    } else {
      switch (childNodeOrToken.text) {
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

  return new CompoundStatement(
    statements,
    openBracePunctuator,
    closeBracePunctuator,
  );
}
