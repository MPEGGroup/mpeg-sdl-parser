import { ClassId } from "../../node/class-id.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { ClassIdRange } from "../../node/class-id-range.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { Token } from "../../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../../node/enum/token-kind.ts";

export function buildClassIdRange(
  buildContext: BuildContext,
): ClassIdRange {
  const startClassId = fetchRequiredNode<ClassId>(
    buildContext,
    NodeKind.CLASS_ID,
  );
  const rangeOperator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.RANGE_OPERATOR,
  );
  const endClassId = fetchRequiredNode<ClassId>(
    buildContext,
    NodeKind.CLASS_ID,
  );

  return new ClassIdRange(
    startClassId,
    rangeOperator,
    endClassId,
    [startClassId, rangeOperator, endClassId],
  );
}
