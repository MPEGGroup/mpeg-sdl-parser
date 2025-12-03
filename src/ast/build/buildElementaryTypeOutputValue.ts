import { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ElementaryTypeOutputValue } from "../node/ElementaryTypeOutputValue.ts";
import { LengthAttribute } from "../node/LengthAttribute.ts";
import type { BuildContext } from "./BuildContext.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";

export function buildElementaryTypeOutputValue(
  buildContext: BuildContext,
): ElementaryTypeOutputValue {
  const elementaryType = fetchRequiredNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );
  const lengthAttribute = fetchRequiredNode<LengthAttribute>(
    buildContext,
    NodeKind.LENGTH_ATTRIBUTE,
  );

  return new ElementaryTypeOutputValue(
    elementaryType,
    lengthAttribute,
    [elementaryType, lengthAttribute],
  );
}
