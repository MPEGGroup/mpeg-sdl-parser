import type { NumberLiteral } from "../../node/number-literal.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { ClassId } from "../../node/class-id.ts";
import type { BuildContext } from "../util/build-context.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";

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
