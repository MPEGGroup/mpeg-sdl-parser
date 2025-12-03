import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { ExplicitArrayDimension } from "../node/ExplicitArrayDimension.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import { ComputedArrayDefinition } from "../node/ComputedArrayDefinition.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchOneToManyList, fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import { ArrayDimensionKind } from "../node/enum/array_dimension_kind.ts";

export function buildComputedArrayDefinition(
  buildContext: BuildContext,
): ComputedArrayDefinition {
  const computedKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.COMPUTED,
  );
  const elementaryType = fetchRequiredNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  const dimensions = fetchOneToManyList<ExplicitArrayDimension>(
    buildContext,
    NodeKind.ARRAY_DIMENSION,
    ArrayDimensionKind.EXPLICIT,
  );
  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );

  return new ComputedArrayDefinition(
    computedKeyword,
    elementaryType,
    identifier,
    dimensions,
    semicolonPunctuator,
    [
      computedKeyword,
      elementaryType,
      identifier,
      ...dimensions,
      semicolonPunctuator,
    ],
  );
}
