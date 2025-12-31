import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { ClassMemberAccess } from "../../node/class-member-access.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

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
