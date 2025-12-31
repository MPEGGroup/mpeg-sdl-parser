import { InternalParseError } from "../../../parse-error.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import type { NumberLiteral } from "../../node/number-literal.ts";
import { CaseClause } from "../../node/case-clause.ts";
import type { AbstractStatement } from "../../node/abstract-statement.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetch-node.ts";
import type { OptionalNode } from "../../util/types.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

export function buildCaseClause(
  buildContext: BuildContext,
): CaseClause {
  const children: Array<AbstractNode> = [];

  const caseKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CASE,
  );
  children.push(caseKeyword);
  const value = fetchRequiredNode<NumberLiteral>(
    buildContext,
    NodeKind.NUMBER_LITERAL,
  );
  children.push(value);
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
  children.push(...statements);
  const breakKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.BREAK,
  );
  let semicolonPunctuator: OptionalNode<Token> = undefined;
  if (breakKeyword) {
    children.push(breakKeyword);
    semicolonPunctuator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.SEMICOLON,
    );
    if (semicolonPunctuator) {
      children.push(semicolonPunctuator);
    } else {
      throw new InternalParseError(
        "Expected semicolon punctuator ';' after break keyword.",
      );
    }
  }

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
        "Expected close brace punctuator '}' to match open brace punctuator.",
      );
    }
  }

  return new CaseClause(
    caseKeyword,
    value,
    colonPunctuator,
    openBracePunctuator,
    statements,
    breakKeyword,
    semicolonPunctuator,
    closeBracePunctuator,
    children,
  );
}
