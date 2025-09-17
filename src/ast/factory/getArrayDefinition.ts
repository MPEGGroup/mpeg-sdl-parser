import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { ArrayDefinition } from "../node/ArrayDefinition.ts";
import { AlignedModifier } from "../node/AlignedModifier.ts";
import { ImplicitArrayDimension } from "../node/ImplicitArrayDimension.ts";
import type { AbstractArrayDimension } from "../node/AbstractArrayDimension.ts";
import type { ExplicitArrayDimension } from "../node/ExplicitArrayDimension.ts";
import type { PartialArrayDimension } from "../node/PartialArrayDimension.ts";
import { ArrayDimensionKind } from "../node/enum/array_dimension_kind.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import type { LengthAttribute } from "../node/LengthAttribute.ts";

export function getArrayDefinition(
  cursor: TreeCursor,
  text: Text,
): ArrayDefinition {
  let legacyKeyword: Token | undefined;
  let alignedModifier: AlignedModifier | undefined;
  let elementaryType: ElementaryType | undefined;
  let lengthAttribute: LengthAttribute | undefined;
  let classsIdentifier: Identifier | undefined;
  let identifier: Identifier | undefined;
  let implicitArrayDimension: ImplicitArrayDimension | undefined;
  let dimensions:
    | (ExplicitArrayDimension | PartialArrayDimension)[]
    | undefined;
  let reservedKeyword: Token | undefined;
  let semicolonPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          if (elementaryType || classsIdentifier) {
            identifier = childNodeOrToken as Identifier;
          } else {
            classsIdentifier = childNodeOrToken as Identifier;
          }
          break;
        case NodeKind.ALIGNED_MODIFIER:
          alignedModifier = childNodeOrToken as AlignedModifier;
          break;
        case NodeKind.ELEMENTARY_TYPE:
          elementaryType = childNodeOrToken as ElementaryType;
          break;
        case NodeKind.LENGTH_ATTRIBUTE:
          lengthAttribute = childNodeOrToken as LengthAttribute;
          break;
        case NodeKind.ARRAY_DIMENSION: {
          const dimension = childNodeOrToken as AbstractArrayDimension;
          if (dimension.arrayDimensionKind === ArrayDimensionKind.IMPLICIT) {
            implicitArrayDimension = dimension as ImplicitArrayDimension;
          } else {
            if (dimensions === undefined) {
              dimensions = [];
            }
            if (dimension.arrayDimensionKind === ArrayDimensionKind.EXPLICIT) {
              dimensions.push(dimension as ExplicitArrayDimension);
            } else if (
              dimension.arrayDimensionKind === ArrayDimensionKind.PARTIAL
            ) {
              dimensions.push(dimension as PartialArrayDimension);
            }
          }
          break;
        }
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "reserved":
          reservedKeyword = childNodeOrToken;
          break;
        case "legacy":
          legacyKeyword = childNodeOrToken;
          break;
        case ";":
          semicolonPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }

  if (semicolonPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument semicolonPunctuator to be defined",
    );
  }

  return new ArrayDefinition(
    reservedKeyword !== undefined,
    legacyKeyword !== undefined,
    alignedModifier,
    elementaryType,
    lengthAttribute,
    classsIdentifier,
    identifier,
    implicitArrayDimension,
    dimensions,
    reservedKeyword,
    legacyKeyword,
    semicolonPunctuator,
  );
}
