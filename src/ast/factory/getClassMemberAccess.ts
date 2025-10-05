import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { ClassMemberAccess } from "../node/ClassMemberAccess.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getClassMemberAccess(
  cursor: TreeCursor,
  text: Text,
): ClassMemberAccess {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let identifier: Identifier | undefined;
  let classMemberAccessOperator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind === NodeKind.IDENTIFIER) {
        identifier = childNodeOrToken as Identifier;
      } else {
        throw new InternalParseError(
          `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
        );
      }
    } else {
      if (childNodeOrToken.text === ".") {
        classMemberAccessOperator = childNodeOrToken;
      } else {
        throw new InternalParseError(
          `Unexpected token: ${childNodeOrToken.text}`,
        );
      }
    }
  }

  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }

  if (classMemberAccessOperator === undefined) {
    throw new InternalParseError(
      "Expected argument classMemberAccessOperator to be defined",
    );
  }

  return new ClassMemberAccess(
    identifier,
    classMemberAccessOperator,
  );
}
