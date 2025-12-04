import type { RequiredNode } from "../util/types.ts";
import { AbstractClassId } from "./abstract-class-id.ts";
import type { AbstractNode } from "./abstract-node.ts";
import type { ClassId } from "./class-id.ts";
import { ClassIdKind } from "./enum/class-id-kind.ts";
import type { Token } from "./token.ts";

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
