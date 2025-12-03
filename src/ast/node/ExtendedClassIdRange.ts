import { AbstractClassId } from "./AbstractClassId.ts";
import type { ClassId } from "./ClassId.ts";
import type { ClassIdRange } from "./ClassIdRange.ts";
import { ClassIdKind } from "./enum/class_id_kind.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { Token } from "./Token.ts";
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
