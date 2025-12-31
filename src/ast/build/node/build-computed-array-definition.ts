import { NodeKind } from "../../node/enum/node-kind.ts";
import type { Identifier } from "../../node/identifier.ts";
import { ExplicitArrayDimension } from "../../node/explicit-array-dimension.ts";
import type { ElementaryType } from "../../node/elementary-type.ts";
import { ComputedArrayDefinition } from "../../node/computed-array-definition.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchOneToManyList, fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";
import { ArrayDimensionKind } from "../../node/enum/array-dimension-kind.ts";

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
