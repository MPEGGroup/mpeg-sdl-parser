import { Specification } from "../node/Specification.ts";
import type { ComputedElementaryTypeDefinition } from "../node/ComputedElementaryTypeDefinition.ts";
import type { MapDeclaration } from "../node/MapDeclaration.ts";
import type { ClassDeclaration } from "../node/ClassDeclaration.ts";
import type { BuildContext } from "./BuildContext.ts";
import { fetchZeroToManyList } from "../util/fetchNode.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";
import { NodeKind } from "../../../index.ts";

export function buildSpecification(
  buildContext: BuildContext,
): Specification {
  const globals = fetchZeroToManyList<
    | ComputedElementaryTypeDefinition
    | MapDeclaration
    | ClassDeclaration
  >(buildContext, NodeKind.STATEMENT, [
    StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION,
    StatementKind.MAP_DECLARATION,
    StatementKind.CLASS_DECLARATION,
  ]);

  return new Specification(globals);
}
