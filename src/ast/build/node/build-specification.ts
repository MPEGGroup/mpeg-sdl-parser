import { Specification } from "../../node/specification.ts";
import type { ComputedElementaryTypeDefinition } from "../../node/computed-elementary-type-definition.ts";
import type { MapDeclaration } from "../../node/map-declaration.ts";
import type { ClassDeclaration } from "../../node/class-declaration.ts";
import type { BuildContext } from "../util/build-context.ts";
import { fetchZeroToManyList } from "../util/fetch-node.ts";
import { StatementKind } from "../../node/enum/statement-kind.ts";
import { NodeKind } from "../../../../index.ts";

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
