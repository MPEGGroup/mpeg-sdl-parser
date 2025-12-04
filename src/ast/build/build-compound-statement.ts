import { NodeKind } from "../node/enum/node-kind.ts";
import { CompoundStatement } from "../node/compound-statement.ts";
import { AbstractStatement } from "../node/abstract-statement.ts";
import type { BuildContext } from "./build-context.ts";
import { fetchRequiredNode, fetchZeroToManyList } from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import type { Token } from "../node/token.ts";

export function buildCompoundStatement(
  buildContext: BuildContext,
): CompoundStatement {
  const openBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  const statements = fetchZeroToManyList<AbstractStatement>(
    buildContext,
    NodeKind.STATEMENT,
  );
  const closeBracePunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACE,
  );

  return new CompoundStatement(
    openBracePunctuator,
    statements,
    closeBracePunctuator,
    [openBracePunctuator, ...statements, closeBracePunctuator],
  );
}
