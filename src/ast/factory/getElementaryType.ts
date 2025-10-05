import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { ElementaryType } from "../node/ElementaryType.ts";
import type { Token } from "../token/Token.ts";
import { ElementaryTypeKind } from "../node/enum/elementary_type_kind.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getElementaryType(
  cursor: TreeCursor,
  text: Text,
): ElementaryType {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let elementaryTypeKind: ElementaryTypeKind | undefined;
  let unsignedQualifierKeyword: Token | undefined;
  let typeKeyword: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      throw new InternalParseError(
        `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
      );
    } else {
      switch (childNodeOrToken.text) {
        case "unsigned":
          unsignedQualifierKeyword = childNodeOrToken;
          break;
        case "bit":
          elementaryTypeKind = ElementaryTypeKind.BIT;
          typeKeyword = childNodeOrToken;
          break;
        case "int":
          if (unsignedQualifierKeyword) {
            elementaryTypeKind = ElementaryTypeKind.UNSIGNED_INTEGER;
          } else {
            elementaryTypeKind = ElementaryTypeKind.INTEGER;
          }
          typeKeyword = childNodeOrToken;
          break;
        case "float":
          elementaryTypeKind = ElementaryTypeKind.FLOATING_POINT;
          typeKeyword = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (elementaryTypeKind === undefined) {
    throw new InternalParseError(
      "Expected argument elementaryTypeKind to be defined",
    );
  }
  if (typeKeyword === undefined) {
    throw new InternalParseError("Expected argument typeKeyword to be defined");
  }
  return new ElementaryType(
    elementaryTypeKind,
    unsignedQualifierKeyword,
    typeKeyword,
  );
}
