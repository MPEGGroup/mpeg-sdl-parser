import { InternalParseError } from "../../parse-error.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { AbstractStatement } from "../node/abstract-statement.ts";
import { DefaultClause } from "../node/default-clause.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildDefaultClause(
  buildContext: BuildContext,
): DefaultClause {
  const children: Array<AbstractNode> = [];

  const defaultKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.DEFAULT,
  );
  children.push(defaultKeyword);

  const colonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.COLON,
  );
  children.push(colonPunctuator);

  const openBracePunctuator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  if (openBracePunctuator) {
    children.push(openBracePunctuator);
  }

  const statements = fetchZeroToManyList<AbstractStatement>(
    buildContext,
    NodeKind.STATEMENT,
  );

  let closeBracePunctuator: OptionalNode<Token> = undefined;
  if (openBracePunctuator) {
    closeBracePunctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.CLOSE_BRACE,
    );
    if (closeBracePunctuator) {
      children.push(closeBracePunctuator);
    } else {
      throw new InternalParseError(
        "Expected close brace '}' to match open brace",
        (openBracePunctuator as Token).location,
      );
    }
  }

  return new DefaultClause(
    defaultKeyword,
    colonPunctuator,
    openBracePunctuator,
    statements,
    closeBracePunctuator,
    children,
  );
}
