import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { ClassId } from "../node/ClassId.ts";
import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ClassIdRange } from "../node/ClassIdRange.ts";
import type { Token } from "../token/Token.ts";

export function getClassIdRange(
  cursor: TreeCursor,
  text: Text,
): ClassIdRange {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let startClassId: ClassId | undefined;
  let endClassId: ClassId | undefined;
  let rangeOperator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind === NodeKind.CLASS_ID) {
        if (startClassId === undefined) {
          startClassId = childNodeOrToken as ClassId;
        } else {
          endClassId = childNodeOrToken as ClassId;
        }
      } else {
        throw new InternalParseError(
          `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
        );
      }
    } else {
      if (childNodeOrToken.text === "..") {
        rangeOperator = childNodeOrToken;
      } else {
        throw new InternalParseError(
          `Unexpected token: ${childNodeOrToken.text}`,
        );
      }
    }
  }

  if (startClassId === undefined) {
    throw new InternalParseError(
      "Expected argument startClassId to be defined",
    );
  }
  if (endClassId === undefined) {
    throw new InternalParseError("Expected argument endClassId to be defined");
  }
  if (rangeOperator === undefined) {
    throw new InternalParseError(
      "Expected argument rangeOperator to be defined",
    );
  }
  return new ClassIdRange(
    startClassId,
    endClassId,
    rangeOperator,
  );
}
