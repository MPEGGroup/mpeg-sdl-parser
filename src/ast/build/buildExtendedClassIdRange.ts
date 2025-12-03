import { ClassId } from "../node/ClassId.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { ExtendedClassIdRange } from "../node/ExtendedClassIdRange.ts";
import type { ClassIdRange } from "../node/ClassIdRange.ts";
import { ClassIdKind } from "../node/enum/class_id_kind.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { fetchOneToManyCommaSeparatedList } from "../util/fetchNode.ts";

export function buildExtendedClassIdRange(
  buildContext: BuildContext,
): ExtendedClassIdRange {
  const children: Array<AbstractNode> = [];

  const { nodes: classIds, commaPunctuators } =
    fetchOneToManyCommaSeparatedList<ClassId | ClassIdRange>(
      buildContext,
      NodeKind.CLASS_ID,
      [ClassIdKind.SINGLE, ClassIdKind.RANGE],
    );

  return new ExtendedClassIdRange(
    classIds,
    commaPunctuators,
    children,
  );
}
