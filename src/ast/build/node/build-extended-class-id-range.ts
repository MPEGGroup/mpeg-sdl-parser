import { ClassId } from "../../node/class-id.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { ExtendedClassIdRange } from "../../node/extended-class-id-range.ts";
import type { ClassIdRange } from "../../node/class-id-range.ts";
import { ClassIdKind } from "../../node/enum/class-id-kind.ts";
import type { BuildContext } from "../util/build-context.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import { fetchOneToManyCommaSeparatedList } from "../util/fetch-node.ts";

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
