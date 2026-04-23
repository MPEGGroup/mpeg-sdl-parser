import type { MapDeclaration } from "../../ast/node/map-declaration.ts";
import type { MapEntry } from "../../ast/node/map-entry.ts";
import type { AggregateOutputValue } from "../../ast/node/aggregate-output-value.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { isIdentifier, isNumberLiteral } from "../../ast/util/types.ts";
import { ScopeKind, type SymbolTable } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";

function countOutputValues(outputValue: AggregateOutputValue): number {
  return outputValue.outputValues.length;
}

function checkOutputValuesTypeMatch(
  declaration: MapDeclaration,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (declaration.outputElementaryType !== undefined) {
    for (const entry of declaration.mapEntries) {
      if (entry.nodeKind !== NodeKind.MAP_ENTRY) {
        continue;
      }
      const mapEntry = entry as MapEntry;
      if (
        mapEntry.outputValue &&
        mapEntry.outputValue.nodeKind === NodeKind.AGGREGATE_OUTPUT_VALUE
      ) {
        const outputValue = mapEntry.outputValue as AggregateOutputValue;
        if (countOutputValues(outputValue) !== 1) {
          results.push({
            message:
              "The type and number of constituent values within the aggregate output values of the map declaration must match the corresponding constituent types within the map's output_type.",
            location: outputValue.startToken!.getLocation(),
          });
        }
      }
    }
  } else if (
    declaration.outputClassIdentifier !== undefined &&
    isIdentifier(declaration.outputClassIdentifier)
  ) {
    const className = declaration.outputClassIdentifier.name;
    const classScope = symbolTable.getGlobalScope().children.find(
      (scope) => scope.name === className && scope.kind === ScopeKind.CLASS,
    );

    if (classScope?.classMemberSymbols) {
      const expectedMemberCount = classScope.classMemberSymbols.size;

      for (const entry of declaration.mapEntries) {
        if (entry.nodeKind !== NodeKind.MAP_ENTRY) {
          continue;
        }
        const mapEntry = entry as MapEntry;
        if (
          mapEntry.outputValue &&
          mapEntry.outputValue.nodeKind === NodeKind.AGGREGATE_OUTPUT_VALUE
        ) {
          const outputValue = mapEntry.outputValue as AggregateOutputValue;
          if (countOutputValues(outputValue) !== expectedMemberCount) {
            results.push({
              message:
                "The type and number of constituent values within the aggregate output values of the map declaration must match the corresponding constituent types within the map's output_type.",
              location: outputValue.startToken!.getLocation(),
            });
          }
        }
      }
    }
  }

  return results;
}

function hasParsableMembers(
  className: string,
  symbolTable: SymbolTable,
  visited: Set<string>,
): boolean {
  if (visited.has(className)) {
    return false;
  }
  visited.add(className);

  const classScope = symbolTable.getGlobalScope().children.find(
    (scope) => scope.name === className && scope.kind === ScopeKind.CLASS,
  );

  if (!classScope?.classMemberSymbols) {
    return false;
  }

  for (const memberEntries of classScope.classMemberSymbols.values()) {
    for (const entry of memberEntries) {
      if (entry.symbol.attributes.isComputed !== true) {
        return true;
      }
      if (
        entry.symbol.attributes.classType &&
        hasParsableMembers(
          entry.symbol.attributes.classType,
          symbolTable,
          visited,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function checkParsableClassOutput(
  declaration: MapDeclaration,
  symbolTable: SymbolTable,
): CheckResult[] {
  if (
    declaration.outputClassIdentifier === undefined ||
    !isIdentifier(declaration.outputClassIdentifier)
  ) {
    return [];
  }

  const className = declaration.outputClassIdentifier.name;

  if (hasParsableMembers(className, symbolTable, new Set())) {
    return [{
      message:
        "Declaring a map with an output_value consisting of a class with parsable members will result in undefined behaviour.",
      location: declaration.outputClassIdentifier.startToken!.getLocation(),
      isWarning: true,
    }];
  }

  return [];
}

function checkUniqueInputValues(declaration: MapDeclaration): CheckResult[] {
  const results: CheckResult[] = [];
  const seenValues = new Map<number, boolean>();

  for (const entry of declaration.mapEntries) {
    if (entry.nodeKind !== NodeKind.MAP_ENTRY) {
      continue;
    }
    const mapEntry = entry as MapEntry;
    if (isNumberLiteral(mapEntry.inputValue)) {
      const value = mapEntry.inputValue.value;
      if (seenValues.has(value)) {
        results.push({
          message: "Input values in a map declaration must be unique.",
          location: mapEntry.inputValue.startToken!.getLocation(),
        });
      } else {
        seenValues.set(value, true);
      }
    }
  }

  return results;
}

export const checkMapDeclaration: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.MAP_DECLARATION,
  checkFunc: function (
    declaration: MapDeclaration,
    symbolTable: SymbolTable,
    _strict,
  ): CheckResult[] {
    return [
      ...checkOutputValuesTypeMatch(declaration, symbolTable),
      ...checkParsableClassOutput(declaration, symbolTable),
      ...checkUniqueInputValues(declaration),
    ];
  },
};
