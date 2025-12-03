import { ClassId } from "../node/ClassId.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ClassIdRange } from "../node/ClassIdRange.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
