import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ComputedElementaryTypeDefinition } from "../ast/node/ComputedElementaryTypeDefinition.ts";
import type { ElementaryType } from "../ast/node/ElementaryType.ts";
import type { ElementaryTypeDefinition } from "../ast/node/ElementaryTypeDefinition.ts";
import { ElementaryTypeKind } from "../ast/node/enum/elementary_type_kind.ts";
const { join } = doc.builders;

export function printComputedElementaryTypeDefinition(
  path: AstPath<ComputedElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elements = [];

  const computedElementaryTypeDefinition = path.node;
  elements.push(
    getDocWithTrivia(computedElementaryTypeDefinition.computedKeyword),
  );
  if (computedElementaryTypeDefinition.isConst) {
    elements.push(
      getDocWithTrivia(computedElementaryTypeDefinition.constKeyword!),
    );
  }
  elements.push(path.call(print, "elementaryType"));
  elements.push(path.call(print, "identifier"));
  if (computedElementaryTypeDefinition.value !== undefined) {
    elements.push(
      getDocWithTrivia(
        computedElementaryTypeDefinition.assignmentOperator!,
      ),
    );
    elements.push(
      path.call(
        print,
        "value" as keyof ComputedElementaryTypeDefinition["value"],
      ),
    );
  }

  return [
    join(" ", elements),
    getDocWithTrivia(computedElementaryTypeDefinition.semicolonPunctuator),
  ];
}

export function printElementaryType(path: AstPath<ElementaryType>): Doc {
  const elementaryType = path.node;
  const elementaryTypeKind = elementaryType.elementaryTypeKind;

  switch (elementaryTypeKind) {
    case ElementaryTypeKind.BIT:
    case ElementaryTypeKind.FLOATING_POINT:
    case ElementaryTypeKind.INTEGER:
      return getDocWithTrivia(elementaryType.typeKeyword);
    case ElementaryTypeKind.UNSIGNED_INTEGER:
      return join(" ", [
        getDocWithTrivia(elementaryType.unsignedQualifierKeyword!),
        getDocWithTrivia(elementaryType.typeKeyword),
      ]);
    default: {
      const exhaustiveCheck: never = elementaryTypeKind;
      throw new Error(
        "Unreachable code reached, elementaryTypeKind == " + exhaustiveCheck,
      );
    }
  }
}

export function printElementaryTypeDefinition(
  path: AstPath<ElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elementaryTypeDefinition = path.node;

  const elements = [];

  if (elementaryTypeDefinition.isReserved) {
    elements.push(
      getDocWithTrivia(elementaryTypeDefinition.reservedKeyword!),
    );
  }

  if (elementaryTypeDefinition.isLegacy) {
    elements.push(
      getDocWithTrivia(elementaryTypeDefinition.legacyKeyword!),
    );
  }

  if (elementaryTypeDefinition.isConst) {
    elements.push(
      getDocWithTrivia(elementaryTypeDefinition.constKeyword!),
    );
  }

  if (elementaryTypeDefinition.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof ElementaryTypeDefinition["alignedModifier"],
      ),
    );
  }

  const typeClause = [
    path.call(print, "elementaryType"),
    path.call(print, "lengthAttribute"),
  ];

  if (elementaryTypeDefinition.isLookahead) {
    typeClause.push(
      getDocWithTrivia(elementaryTypeDefinition.lookaheadOperator!),
    );
  }
  elements.push(typeClause);
  elements.push(path.call(print, "identifier"));

  if (elementaryTypeDefinition.assignmentOperator !== undefined) {
    elements.push(
      getDocWithTrivia(elementaryTypeDefinition.assignmentOperator!),
    );
    elements.push(
      path.call(print, "value" as keyof ElementaryTypeDefinition["value"]),
    );
    if (elementaryTypeDefinition.endValue !== undefined) {
      elements.push(
        getDocWithTrivia(elementaryTypeDefinition.rangeOperator!),
      );
      elements.push(
        path.call(
          print,
          "endValue" as keyof ElementaryTypeDefinition["endValue"],
        ),
      );
    }
  }

  return [
    join(" ", elements),
    getDocWithTrivia(elementaryTypeDefinition.semicolonPunctuator),
  ];
}
