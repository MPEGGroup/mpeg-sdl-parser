import type { MapDefinition } from "../../ast/node/map-definition.ts";
import type { MapDeclaration } from "../../ast/node/map-declaration.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { isIdentifier } from "../../ast/util/types.ts";
import type { SymbolTable } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";
import type { ElementaryType } from "../../ast/node/elementary-type.ts";
import { ElementaryTypeKind } from "../../ast/node/enum/elementary-type-kind.ts";
import { getElementaryTypeKind } from "../util/symbol-table-utils.ts";

function checkMapTypeMatchesDeclaration(
  definition: MapDefinition,
  symbolTable: SymbolTable,
  strict: boolean,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!isIdentifier(definition.mapIdentifier)) {
    return results;
  }

  const mapSymbol = symbolTable.lookupMap(definition.mapIdentifier.name);
  if (!mapSymbol) {
    return results;
  }

  const mapDeclaration = mapSymbol.node as MapDeclaration;

  // Compare element types
  const defHasElementaryType = definition.elementaryType !== undefined;
  const declHasElementaryType =
    mapDeclaration.outputElementaryType !== undefined;
  const defHasClassType = definition.classIdentifier !== undefined;
  const declHasClassType = mapDeclaration.outputClassIdentifier !== undefined;

  if (
    defHasElementaryType !== declHasElementaryType ||
    defHasClassType !== declHasClassType
  ) {
    const location = definition.elementaryType?.startToken?.getLocation() ||
      definition.classIdentifier?.startToken?.getLocation() ||
      definition.mapIdentifier.startToken!.getLocation();
    results.push({
      message:
        "The type of the map definition must match the output_type of the map declaration.",
      location,
    });
  } else if (defHasElementaryType && declHasElementaryType) {
    // Both have elementary types - compare them
    const defType = definition.elementaryType! as ElementaryType;
    const declType = mapDeclaration.outputElementaryType! as ElementaryType;

    const defTypeKind = getElementaryTypeKind(defType, strict);
    const declTypeKind = getElementaryTypeKind(declType, strict);

    const isIntegerCompatible = (
      k1: ElementaryTypeKind | undefined,
      k2: ElementaryTypeKind | undefined,
    ): boolean => {
      if (k1 === undefined || k2 === undefined) return false;
      const intTypes = new Set([
        ElementaryTypeKind.INTEGER,
        ElementaryTypeKind.UNSIGNED_INTEGER,
      ]);
      return intTypes.has(k1) && intTypes.has(k2);
    };

    if (
      defType.nodeKind !== declType.nodeKind ||
      (defTypeKind !== declTypeKind &&
        !isIntegerCompatible(defTypeKind, declTypeKind))
    ) {
      results.push({
        message:
          "The type of the map definition must match the output_type of the map declaration.",
        location: definition.elementaryType!.startToken!.getLocation(),
      });
    }
  } else if (defHasClassType && declHasClassType) {
    // Both have class types - compare them
    if (
      isIdentifier(definition.classIdentifier) &&
      isIdentifier(mapDeclaration.outputClassIdentifier)
    ) {
      if (
        definition.classIdentifier.name !==
          mapDeclaration.outputClassIdentifier.name
      ) {
        results.push({
          message:
            "The type of the map definition must match the output_type of the map declaration.",
          location: definition.classIdentifier.startToken!.getLocation(),
        });
      }
    }
  }

  return results;
}

export const checkMapDefinition: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.MAP_DEFINITION,
  checkFunc: function (
    definition: MapDefinition,
    symbolTable: SymbolTable,
    strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    results.push(
      ...checkMapTypeMatchesDeclaration(definition, symbolTable, strict),
    );

    return results;
  },
};
