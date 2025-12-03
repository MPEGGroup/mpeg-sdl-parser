import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { AbstractStatement } from "../node/AbstractStatement.ts";
import { DefaultClause } from "../node/DefaultClause.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetchNode.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
