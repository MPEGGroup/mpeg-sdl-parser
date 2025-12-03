import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ClassId } from "../node/ClassId.ts";
import type { BuildContext } from "./BuildContext.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";

export function buildClassId(
  buildContext: BuildContext,
): ClassId {
  const value = fetchRequiredNode<NumberLiteral>(
    buildContext,
    NodeKind.NUMBER_LITERAL,
  );

  return new ClassId(
    value,
    [value],
  );
}
