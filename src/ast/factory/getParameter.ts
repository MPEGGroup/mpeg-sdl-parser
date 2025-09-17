import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { Parameter } from "../node/Parameter.ts";
import type { Identifier } from "../node/Identifier.ts";

export function getParameter(
  cursor: TreeCursor,
  text: Text,
): Parameter {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let classIdentifier: Identifier | undefined;
  let elementaryType: ElementaryType | undefined;
  let identifier: Identifier | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          if (
            (classIdentifier === undefined) && (elementaryType === undefined)
          ) {
            classIdentifier = childNodeOrToken as Identifier;
          } else {
            identifier = childNodeOrToken as Identifier;
          }
          break;
        case NodeKind.ELEMENTARY_TYPE:
          elementaryType = childNodeOrToken as ElementaryType;
          break;
        default:
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

  return new Parameter(
    classIdentifier,
    elementaryType,
    identifier!,
  );
}
