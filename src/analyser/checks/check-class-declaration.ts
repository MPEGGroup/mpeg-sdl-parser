import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { NumberLiteralKind } from "../../ast/node/enum/number-literal-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import type { ParameterList } from "../../ast/node/parameter-list.ts";
import {
  isCompositeNode,
  isExpandableModifier,
  isIdentifier,
  isNumberLiteral,
  isToken,
} from "../../ast/util/types.ts";
import { getRequiredIdentifier } from "../util/symbol-table-utils.ts";
import type { Check, CheckResult } from "./check.ts";
import type { Parameter } from "../../ast/node/parameter.ts";

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
          location: maxClassSize.startToken!.location,
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
      location: declaration.abstractKeyword.location,
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
        location: identifier.startToken!.location,
      });
    }
  }

  return results;
}

export const checkClassDeclaration: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.CLASS_DECLARATION,
  checkFunc: function (
    declaration: ClassDeclaration,
    _symbolTable,
    strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    results.push(...checkMaxClassSizePositiveInteger(declaration));
    results.push(...checkExpandableCannotBeAbstract(declaration));
    results.push(...checkParameterReferencedWithinClass(declaration, strict));

    return results;
  },
};
