import { NodeKind } from "../node/enum/node_kind.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import { AbstractStatement } from "../node/AbstractStatement.ts";
import type { BuildContext } from "./BuildContext.ts";
import { fetchRequiredNode, fetchZeroToManyList } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { Token } from "../node/Token.ts";

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
