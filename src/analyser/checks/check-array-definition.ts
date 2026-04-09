import type { ArrayDefinition } from "../../ast/node/array-definition.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import { ArrayDimensionKind } from "../../ast/node/enum/array-dimension-kind.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { ExplicitArrayDimension } from "../../ast/node/explicit-array-dimension.ts";
import { isIdentifier, isNumberLiteral } from "../../ast/util/types.ts";
import type { SymbolTable } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";

function checkArrayDimensionsPositiveInteger(
  definition: ArrayDefinition,
): CheckResult[] {
  const results: CheckResult[] = [];

  for (const dimension of definition.dimensions) {
    if (dimension.nodeKind === NodeKind.ARRAY_DIMENSION) {
      const explicitDimension = dimension as ExplicitArrayDimension;
      if (
        explicitDimension.arrayDimensionKind === ArrayDimensionKind.EXPLICIT
      ) {
        const size = explicitDimension.size;

        // Only check direct NumberLiterals, skip expressions as per spec note
        if (isNumberLiteral(size)) {
          if (
            size.value <= 0 ||
            size.numberLiteralKind !== NumberLiteralKind.INTEGER
          ) {
            results.push({
              message: "Array dimensions must be a positive integer.",
              location: size.startToken!.location,
            });
          }
        }
      }
    }
  }

  return results;
}

function checkImplicitArrayClassId(
  definition: ArrayDefinition,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (
    definition.implicitArrayDimension &&
    definition.classIdentifier &&
    isIdentifier(definition.classIdentifier)
  ) {
    const classSymbol = symbolTable.lookupClass(
      definition.classIdentifier.name,
    );

    if (classSymbol) {
      const classDeclaration = classSymbol.node as ClassDeclaration;

      if (!classDeclaration.bitModifier) {
        results.push({
          message:
            "Implicit arrays can only contain classes which have a classId defined.",
          location: definition.classIdentifier.startToken!.location,
        });
      }
    }
  }

  return results;
}

export const checkArrayDefinition: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.ARRAY_DEFINITION,
  checkFunc: function (
    definition: ArrayDefinition,
    symbolTable: SymbolTable,
    _strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    results.push(...checkArrayDimensionsPositiveInteger(definition));
    results.push(...checkImplicitArrayClassId(definition, symbolTable));

    return results;
  },
};
