import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { ClassId } from "../node/ClassId.ts";
import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import { ExtendedClassIdRange } from "../node/ExtendedClassIdRange.ts";
import type { ClassIdRange } from "../node/ClassIdRange.ts";
import type { AbstractClassId } from "../node/AbstractClassId.ts";
import { ClassIdKind } from "../node/enum/class_id_kind.ts";

export function getExtendedClassIdRange(
  cursor: TreeCursor,
  text: Text,
): ExtendedClassIdRange {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  const classIds: (ClassId | ClassIdRange)[] = [];
  const commaPunctuators: Token[] = [];

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind === NodeKind.CLASS_ID) {
        if (
          (childNodeOrToken as AbstractClassId).classIdKind ===
            ClassIdKind.SINGLE
        ) {
          classIds.push(childNodeOrToken as ClassId);
        } else if (
          (childNodeOrToken as AbstractClassId).classIdKind ===
            ClassIdKind.RANGE
        ) {
          classIds.push(childNodeOrToken as ClassIdRange);
        } else {
          throw new InternalParseError(
            `Unexpected class ID kind: ${
              ClassIdKind[(childNodeOrToken as AbstractClassId).classIdKind]
            }`,
          );
        }
      } else {
        throw new InternalParseError(
          `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
        );
      }
    } else {
      if (childNodeOrToken.text === ",") {
        commaPunctuators.push(childNodeOrToken);
      } else {
        throw new InternalParseError(
          `Unexpected token: ${childNodeOrToken.text}`,
        );
      }
    }
  }

  return new ExtendedClassIdRange(
    classIds,
    commaPunctuators,
  );
}
