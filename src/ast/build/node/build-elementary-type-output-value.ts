import { ElementaryType } from "../../node/elementary-type.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { ElementaryTypeOutputValue } from "../../node/elementary-type-output-value.ts";
import { LengthAttribute } from "../../node/length-attribute.ts";
import type { BuildContext } from "../util/build-context.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";

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
