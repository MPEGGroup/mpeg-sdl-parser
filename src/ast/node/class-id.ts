import type { RequiredNode } from "../util/types.ts";
import { AbstractClassId } from "./abstract-class-id.ts";
import type { AbstractNode } from "./abstract-node.ts";
import { ClassIdKind } from "./enum/class-id-kind.ts";
import type { NumberLiteral } from "./number-literal.ts";

export class ClassId extends AbstractClassId {
  constructor(
    public readonly value: RequiredNode<NumberLiteral>,
    children: Array<AbstractNode>,
  ) {
    super(ClassIdKind.SINGLE, children);
  }
}
