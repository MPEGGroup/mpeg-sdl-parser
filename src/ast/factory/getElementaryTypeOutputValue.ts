import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ElementaryTypeOutputValue } from "../node/ElementaryTypeOutputValue.ts";
import { LengthAttribute } from "../node/LengthAttribute.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getElementaryTypeOutputValue(
  cursor: TreeCursor,
  text: Text,
): ElementaryTypeOutputValue {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let elementaryType: ElementaryType | undefined;
  let lengthAttribute: LengthAttribute | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.ELEMENTARY_TYPE:
          elementaryType = childNodeOrToken as ElementaryType;
          break;
        case NodeKind.LENGTH_ATTRIBUTE:
          lengthAttribute = childNodeOrToken as LengthAttribute;
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

  if (elementaryType === undefined) {
    throw new InternalParseError(
      "Expected argument elementaryType to be defined",
    );
  }
  if (lengthAttribute === undefined) {
    throw new InternalParseError(
      "Expected argument lengthAttribute to be defined",
    );
  }
  return new ElementaryTypeOutputValue(
    elementaryType,
    lengthAttribute,
  );
}
