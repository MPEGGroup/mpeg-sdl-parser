import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ClassId } from "../node/ClassId.ts";

export function getClassId(
  cursor: TreeCursor,
  text: Text,
): ClassId {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let value: NumberLiteral | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind === NodeKind.NUMBER_LITERAL) {
        value = childNodeOrToken as NumberLiteral;
      } else {
        throw new InternalParseError(
          `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
        );
      }
    } else {
      throw new InternalParseError(
        `Unexpected token: ${childNodeOrToken.text}`,
      );
    }
  }
  if (value === undefined) {
    throw new InternalParseError("Expected argument value to be defined");
  }
  return new ClassId(
    value,
  );
}
