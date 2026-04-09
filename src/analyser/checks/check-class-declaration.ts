import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { ClassIdKind } from "../../ast/node/enum/class-id-kind.ts";
import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import type { ParameterList } from "../../ast/node/parameter-list.ts";
import type { ClassDefinition } from "../../ast/node/class-definition.ts";
import type { ClassIdRange } from "../../ast/node/class-id-range.ts";
import type { ClassId } from "../../ast/node/class-id.ts";
import {
  isAlignedModifier,
  isBitModifier,
  isCompositeNode,
  isExpandableModifier,
  isExtendsModifier,
  isIdentifier,
  isNumberLiteral,
  isToken,
} from "../../ast/util/types.ts";
import { getRequiredIdentifier } from "../util/symbol-table-utils.ts";
import type { Check, CheckResult } from "./check.ts";
import type { Parameter } from "../../ast/node/parameter.ts";
import type { SymbolTable } from "../symbol-table.ts";
import type { AbstractClassId } from "../../ast/node/abstract-class-id.ts";

function collectAllIdentifiers(node: AbstractNode): string[] {
  const identifiers: string[] = [];

  if (isIdentifier(node)) {
    identifiers.push(node.name);
  }

  if (isCompositeNode(node)) {
    for (const child of node.children) {
      identifiers.push(...collectAllIdentifiers(child));
    }
  }

  return identifiers;
}

function checkMaxClassSizePositiveInteger(
  declaration: ClassDeclaration,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (
    declaration.expandableModifier &&
    isExpandableModifier(declaration.expandableModifier)
  ) {
    const maxClassSize = declaration.expandableModifier.maxClassSize;
    if (maxClassSize && isNumberLiteral(maxClassSize)) {
      if (
        maxClassSize.value <= 0 ||
        maxClassSize.numberLiteralKind !== NumberLiteralKind.INTEGER
      ) {
        results.push({
          message: "maxClassSize must be a positive integer",
          location: maxClassSize.startToken!.getLocation(),
        });
      }
    }
  }

  return results;
}

function checkExpandableCannotBeAbstract(
  declaration: ClassDeclaration,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (
    declaration.expandableModifier &&
    isExpandableModifier(declaration.expandableModifier) &&
    declaration.abstractKeyword && isToken(declaration.abstractKeyword)
  ) {
    results.push({
      message:
        "Because the class is expandable, it has an encoded sizeOfInstance value therefore it cannot be abstract.",
      location: declaration.abstractKeyword.getLocation(),
    });
  }

  return results;
}

function checkParameterReferencedWithinClass(
  declaration: ClassDeclaration,
  strict: boolean,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (
    !declaration.parameterList ||
    declaration.parameterList.nodeKind !== NodeKind.PARAMETER_LIST
  ) {
    return results;
  }

  const parameterList = declaration.parameterList as ParameterList;

  const classBodyIdentifiers = new Set<string>();
  for (const statement of declaration.statements) {
    for (const name of collectAllIdentifiers(statement)) {
      classBodyIdentifiers.add(name);
    }
  }

  for (const param of parameterList.parameters) {
    if (param.nodeKind !== NodeKind.PARAMETER) {
      continue;
    }
    const parameter = param as Parameter;
    const identifier = getRequiredIdentifier(
      parameter.identifier,
      parameter,
      strict,
    );
    if (identifier && !classBodyIdentifiers.has(identifier.name)) {
      results.push({
        message:
          "A parameter in a parameter list must be referenced within the class declaration.",
        location: identifier.startToken!.getLocation(),
      });
    }
  }

  return results;
}

function checkClassIdNotInValidRangeOfBaseClass(
  declaration: ClassDeclaration,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!isExtendsModifier(declaration.extendsModifier)) {
    return results;
  }

  const extendsModifier = declaration.extendsModifier;

  if (!isIdentifier(extendsModifier.identifier)) {
    return results;
  }

  const baseClassSymbol = symbolTable.lookupClass(
    extendsModifier.identifier.name,
  );

  if (!baseClassSymbol) {
    return results;
  }

  const baseClass = baseClassSymbol.node as ClassDeclaration;

  if (!isBitModifier(baseClass.bitModifier)) {
    return results;
  }

  if (!isBitModifier(declaration.bitModifier)) {
    return results;
  }

  const baseBitModifier = baseClass.bitModifier;
  const thisBitModifier = declaration.bitModifier;

  if (
    (baseBitModifier.classId as AbstractClassId).classIdKind ===
      ClassIdKind.RANGE
  ) {
    const baseRange = baseBitModifier.classId as ClassIdRange;
    const baseStartClassId = baseRange.startClassId as ClassId;
    const baseEndClassId = baseRange.endClassId as ClassId;
    const baseMin = isNumberLiteral(baseStartClassId.value)
      ? baseStartClassId.value.value
      : null;
    const baseMax = isNumberLiteral(baseEndClassId.value)
      ? baseEndClassId.value.value
      : null;

    if (baseMin !== null && baseMax !== null) {
      if (
        (thisBitModifier.classId as AbstractClassId).classIdKind ===
          ClassIdKind.SINGLE
      ) {
        const thisClassId = thisBitModifier.classId as ClassId;
        const thisValue = isNumberLiteral(thisClassId.value)
          ? thisClassId.value.value
          : null;
        if (
          thisValue !== null && (thisValue < baseMin || thisValue > baseMax)
        ) {
          results.push({
            message:
              "The specified classId is not within the range of valid classIds specified in the base class.",
            location: thisBitModifier.startToken!.getLocation(),
          });
        }
      } else if (
        (thisBitModifier.classId as AbstractClassId).classIdKind ===
          ClassIdKind.RANGE
      ) {
        const thisRange = thisBitModifier.classId as ClassIdRange;
        const thisStartClassId = thisRange.startClassId as ClassId;
        const thisEndClassId = thisRange.endClassId as ClassId;
        const thisMin = isNumberLiteral(thisStartClassId.value)
          ? thisStartClassId.value.value
          : null;
        const thisMax = isNumberLiteral(thisEndClassId.value)
          ? thisEndClassId.value.value
          : null;

        if (
          (thisMin !== null) && (thisMax !== null) &&
          ((thisMin < baseMin) || (thisMax > baseMax))
        ) {
          results.push({
            message:
              "The specified classId is not within the range of valid classIds specified in the base class.",
            location: thisBitModifier.startToken!.getLocation(),
          });
        }
      }
    }
  }

  return results;
}

function checkCannotExtendItself(
  declaration: ClassDeclaration,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!isExtendsModifier(declaration.extendsModifier)) {
    return results;
  }

  const extendsModifier = declaration.extendsModifier;

  if (
    !isIdentifier(extendsModifier.identifier) ||
    !isIdentifier(declaration.identifier)
  ) {
    return results;
  }

  if (extendsModifier.identifier.name === declaration.identifier.name) {
    results.push({
      message: "A class cannot extend itself.",
      location: extendsModifier.identifier.startToken!.getLocation(),
    });
  }

  return results;
}

function checkCannotRecursivelyContainItself(
  declaration: ClassDeclaration,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!isIdentifier(declaration.identifier)) {
    return results;
  }

  const className = declaration.identifier.name;

  function checkRecursive(statements: AbstractNode[]): boolean {
    for (const statement of statements) {
      if (
        statement.nodeKind === NodeKind.STATEMENT &&
        (statement as { statementKind?: StatementKind }).statementKind ===
          StatementKind.CLASS_DEFINITION
      ) {
        const classDef = statement as ClassDefinition;
        if (
          isIdentifier(classDef.classIdentifier) &&
          classDef.classIdentifier.name === className
        ) {
          return true;
        }
      }
    }
    return false;
  }

  if (checkRecursive(declaration.statements)) {
    results.push({
      message: "A class cannot recursively contain itself as a member.",
      location: declaration.identifier.startToken!.getLocation(),
    });
  }

  return results;
}

function checkExpandableCannotExtendExpandable(
  declaration: ClassDeclaration,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!isExpandableModifier(declaration.expandableModifier)) {
    return results;
  }

  if (!isExtendsModifier(declaration.extendsModifier)) {
    return results;
  }

  const extendsModifier = declaration.extendsModifier;

  if (!isIdentifier(extendsModifier.identifier)) {
    return results;
  }

  const baseClassSymbol = symbolTable.lookupClass(
    extendsModifier.identifier.name,
  );

  if (!baseClassSymbol) {
    return results;
  }

  const baseClass = baseClassSymbol.node as ClassDeclaration;

  if (isExpandableModifier(baseClass.expandableModifier)) {
    results.push({
      message: "An expandable class cannot extend an expandable class.",
      location: declaration.expandableModifier.startToken!.getLocation(),
    });
  }

  return results;
}

function checkAlignmentMustMatchBaseClass(
  declaration: ClassDeclaration,
  symbolTable: SymbolTable,
): CheckResult[] {
  const results: CheckResult[] = [];

  if (!isExtendsModifier(declaration.extendsModifier)) {
    return results;
  }

  const extendsModifier = declaration.extendsModifier;

  if (!isIdentifier(extendsModifier.identifier)) {
    return results;
  }

  const identifier = extendsModifier.identifier;

  const baseClassSymbol = symbolTable.lookupClass(identifier.name);
  if (!baseClassSymbol) {
    return results;
  }

  const baseClass = baseClassSymbol.node as ClassDeclaration;

  if (isAlignedModifier(declaration.alignedModifier)) {
    if (isAlignedModifier(baseClass.alignedModifier)) {
      if (
        declaration.alignedModifier.alignment !==
          baseClass.alignedModifier.alignment
      ) {
        results.push({
          message:
            "The alignment of a class which extends another must not differ from the alignment of the base class.",
          location: identifier.startToken!.getLocation(),
        });
      }
    }
  } else if (!isAlignedModifier(baseClass.alignedModifier)) {
    return results;
  }
  const location = identifier.startToken!.getLocation();
  results.push({
    message:
      "The alignment of a class which extends another must not differ from the alignment of the base class.",
    location,
  });

  return results;
}

export const checkClassDeclaration: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.CLASS_DECLARATION,
  checkFunc: function (
    declaration: ClassDeclaration,
    symbolTable: SymbolTable,
    strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    results.push(...checkMaxClassSizePositiveInteger(declaration));
    results.push(...checkExpandableCannotBeAbstract(declaration));
    results.push(...checkParameterReferencedWithinClass(declaration, strict));
    results.push(
      ...checkClassIdNotInValidRangeOfBaseClass(declaration, symbolTable),
    );
    results.push(...checkCannotExtendItself(declaration));
    results.push(...checkCannotRecursivelyContainItself(declaration));
    results.push(
      ...checkExpandableCannotExtendExpandable(declaration, symbolTable),
    );
    results.push(...checkAlignmentMustMatchBaseClass(declaration, symbolTable));

    return results;
  },
};
