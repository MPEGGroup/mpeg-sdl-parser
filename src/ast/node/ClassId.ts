import type { RequiredNode } from "../util/types.ts";
import { AbstractClassId } from "./AbstractClassId.ts";
import type { AbstractNode } from "./AbstractNode.ts";
import { ClassIdKind } from "./enum/class_id_kind.ts";
import type { NumberLiteral } from "./NumberLiteral.ts";

export class ClassId extends AbstractClassId {
  constructor(
    public readonly value: RequiredNode<NumberLiteral>,
    children: Array<AbstractNode>,
  ) {
    super(ClassIdKind.SINGLE, children);
  }
}
