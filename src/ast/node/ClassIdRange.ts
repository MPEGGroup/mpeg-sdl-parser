import type { RequiredNode } from "../util/types.ts";
import { AbstractClassId } from "./AbstractClassId.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import type { ClassId } from "./ClassId.ts";
import { ClassIdKind } from "./enum/class_id_kind.ts";
import type { Token } from "./Token.ts";

export class ClassIdRange extends AbstractClassId {
  constructor(
    public readonly startClassId: RequiredNode<ClassId>,
    public readonly rangeOperator: RequiredNode<Token>,
    public readonly endClassId: RequiredNode<ClassId>,
    children: Array<AbstractNode>,
  ) {
    super(ClassIdKind.RANGE, children);
  }
}
