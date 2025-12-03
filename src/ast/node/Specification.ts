import { AbstractCompositeNode } from "./AbstractCompositeNode.ts";
import type { ClassDeclaration } from "./ClassDeclaration.ts";
import type { ComputedElementaryTypeDefinition } from "./ComputedElementaryTypeDefinition.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { MapDeclaration } from "./MapDeclaration.ts";
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
