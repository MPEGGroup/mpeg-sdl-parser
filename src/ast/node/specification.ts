import { AbstractCompositeNode } from "./abstract-composite-node.ts";
import type { ClassDeclaration } from "./class-declaration.ts";
import type { ComputedElementaryTypeDefinition } from "./computed-elementary-type-definition.ts";
import { NodeKind } from "./enum/node-kind.ts";
import type { MapDeclaration } from "./map-declaration.ts";
import type { ZeroToManyList } from "../util/types.ts";

export class Specification extends AbstractCompositeNode {
  constructor(
    globals: ZeroToManyList<
      | ComputedElementaryTypeDefinition
      | MapDeclaration
      | ClassDeclaration
    >,
  ) {
    super(
      NodeKind.SPECIFICATION,
      globals,
    );
  }
}
