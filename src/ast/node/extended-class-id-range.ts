import { AbstractClassId } from "./abstract-class-id.ts";
import type { ClassId } from "./class-id.ts";
import type { ClassIdRange } from "./class-id-range.ts";
import { ClassIdKind } from "./enum/class-id-kind.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { Token } from "./token.ts";
import type { OneToManyList, ZeroToManyList } from "../util/types.ts";

export class ExtendedClassIdRange extends AbstractClassId {
  constructor(
    public readonly classIds: OneToManyList<ClassId | ClassIdRange>,
    public readonly commaPunctuators: ZeroToManyList<Token>,
    children: Array<AbstractNode>,
  ) {
    super(
      ClassIdKind.EXTENDED_RANGE,
      children,
    );
  }
}
