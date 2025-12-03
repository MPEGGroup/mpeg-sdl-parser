import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { ClassMemberAccess } from "../node/ClassMemberAccess.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildClassMemberAccess(
  buildContext: BuildContext,
): ClassMemberAccess {
  const classMemberAccessOperator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.PERIOD,
  );
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );

  return new ClassMemberAccess(
    classMemberAccessOperator,
    identifier,
    [classMemberAccessOperator, identifier],
  );
}
