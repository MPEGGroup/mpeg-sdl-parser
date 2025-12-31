import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { ArrayDefinition } from "../../node/array-definition.ts";
import { AlignedModifier } from "../../node/aligned-modifier.ts";
import { ImplicitArrayDimension } from "../../node/implicit-array-dimension.ts";
import type { ExplicitArrayDimension } from "../../node/explicit-array-dimension.ts";
import type { PartialArrayDimension } from "../../node/partial-array-dimension.ts";
import type { ElementaryType } from "../../node/elementary-type.ts";
import type { LengthAttribute } from "../../node/length-attribute.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Token } from "../../node/token.ts";
import {
  fetchOptionalNode,
  fetchRequiredNode,
  fetchZeroToManyList,
} from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import { InternalParseError } from "../../../parse-error.ts";
import type { OptionalNode, ZeroToManyList } from "../../util/types.ts";
import { ArrayDimensionKind } from "../../node/enum/array-dimension-kind.ts";

export function buildArrayDefinition(
  buildContext: BuildContext,
): ArrayDefinition {
  const children: Array<AbstractNode> = [];

  const reservedKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  if (reservedKeyword) {
    children.push(reservedKeyword);
  }

  const legacyKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.LEGACY,
  );
  if (legacyKeyword) {
    children.push(legacyKeyword);
  }

  const alignedModifier = fetchOptionalNode<AlignedModifier>(
    buildContext,
    NodeKind.ALIGNED_MODIFIER,
  );
  if (alignedModifier) {
    children.push(alignedModifier);
  }

  const elementaryType = fetchOptionalNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );

  let lengthAttribute: OptionalNode<LengthAttribute> = undefined;
  let classIdentifier: OptionalNode<Identifier> = undefined;
  if (elementaryType) {
    children.push(elementaryType);
    lengthAttribute = fetchOptionalNode<LengthAttribute>(
      buildContext,
      NodeKind.LENGTH_ATTRIBUTE,
    );
    if (lengthAttribute) {
      children.push(lengthAttribute);
    } else {
      // If an elementary type is present, a length attribute must be present
      throw new InternalParseError(
        "Expected LengthAttribute node after ElementaryType node",
      );
    }
  } else {
    classIdentifier = fetchOptionalNode<Identifier>(
      buildContext,
      NodeKind.IDENTIFIER,
    );
    if (classIdentifier) {
      children.push(classIdentifier);
    }
  }
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(identifier);

  let dimensions: ZeroToManyList<
    ExplicitArrayDimension | PartialArrayDimension
  > = [];
  const implicitArrayDimension = fetchOptionalNode<ImplicitArrayDimension>(
    buildContext,
    NodeKind.ARRAY_DIMENSION,
    ArrayDimensionKind.IMPLICIT,
  );
  if (implicitArrayDimension) {
    children.push(implicitArrayDimension);
  } else {
    dimensions = fetchZeroToManyList<
      ExplicitArrayDimension | PartialArrayDimension
    >(
      buildContext,
      NodeKind.ARRAY_DIMENSION,
      [ArrayDimensionKind.EXPLICIT, ArrayDimensionKind.PARTIAL],
    );
    children.push(...dimensions);
  }

  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );
  children.push(semicolonPunctuator);

  return new ArrayDefinition(
    reservedKeyword,
    legacyKeyword,
    alignedModifier,
    elementaryType,
    lengthAttribute,
    classIdentifier,
    identifier,
    implicitArrayDimension,
    dimensions,
    semicolonPunctuator,
    children,
  );
}
