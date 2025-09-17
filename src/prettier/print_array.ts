import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { PartialArrayDimension } from "../ast/node/PartialArrayDimension.ts";
import { ArrayDimensionKind } from "../ast/node/enum/array_dimension_kind.ts";
import type { ArrayDefinition } from "../ast/node/ArrayDefinition.ts";
import type { AbstractArrayDimension } from "../ast/node/AbstractArrayDimension.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ComputedArrayDefinition } from "../ast/node/ComputedArrayDefinition.ts";
import type { ExplicitArrayDimension } from "../ast/node/ExplicitArrayDimension.ts";
import type { ImplicitArrayDimension } from "../ast/node/ImplicitArrayDimension.ts";
const { join } = doc.builders;

export function printAbstractArrayDimension(
  path: AstPath<AbstractArrayDimension>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { arrayDimensionKind } = path.node;
  switch (arrayDimensionKind) {
    case ArrayDimensionKind.EXPLICIT: {
      const explicitArrayDimensionNode = path.node as ExplicitArrayDimension;
      return [
        getDocWithTrivia(explicitArrayDimensionNode.openBracketPunctuator),
        (path as AstPath<ExplicitArrayDimension>).call(print, "size"),
        getDocWithTrivia(
          explicitArrayDimensionNode.closeBracketPunctuator,
        ),
      ];
    }
    case ArrayDimensionKind.PARTIAL: {
      const partialArrayDimensionNode = path.node as PartialArrayDimension;
      return [
        getDocWithTrivia(partialArrayDimensionNode.openBracketPunctuator),
        getDocWithTrivia(
          partialArrayDimensionNode.innerOpenBracketPunctuator,
        ),
        (path as AstPath<PartialArrayDimension>).call(print, "index"),
        getDocWithTrivia(
          partialArrayDimensionNode.innerCloseBracketPunctuator,
        ),
        getDocWithTrivia(partialArrayDimensionNode.closeBracketPunctuator),
      ];
    }
    case ArrayDimensionKind.IMPLICIT: {
      const node = path.node as ImplicitArrayDimension;
      const elements = [];

      elements.push(getDocWithTrivia(node.openBracketPunctuator));
      elements.push("[");

      if (node.rangeStart !== undefined) {
        elements.push(
          path.call(
            print,
            "rangeStart" as keyof ImplicitArrayDimension["rangeStart"],
          ),
        );
      }

      if (node.rangeEnd !== undefined) {
        elements.push(getDocWithTrivia(node.rangeOperator!));
        elements.push(
          path.call(
            print,
            "rangeEnd" as keyof ImplicitArrayDimension["rangeEnd"],
          ),
        );
      }

      elements.push(getDocWithTrivia(node.closeBracketPunctuator));
      return elements;
    }

    default: {
      const exhaustiveCheck: never = arrayDimensionKind;
      throw new Error(
        "Unreachable code reached, arrayDimensionKind == " + exhaustiveCheck,
      );
    }
  }
}

export function printArrayDefinition(
  path: AstPath<ArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const arrayDefinition = path.node;

  const elements = [];

  if (arrayDefinition.isReserved) {
    elements.push(getDocWithTrivia(arrayDefinition.reservedKeyword!));
  }

  if (arrayDefinition.isLegacy) {
    elements.push(getDocWithTrivia(arrayDefinition.legacyKeyword!));
  }

  if (arrayDefinition.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof ArrayDefinition["alignedModifier"],
      ),
    );
  }

  if (arrayDefinition.elementaryType !== undefined) {
    const subElements = [
      path.call(
        print,
        "elementaryType" as keyof ArrayDefinition["elementaryType"],
      ),
      path.call(
        print,
        "lengthAttribute" as keyof ArrayDefinition["lengthAttribute"],
      ),
    ];
    elements.push(subElements);
  } else {
    elements.push(
      path.call(
        print,
        "classIdentifier" as keyof ArrayDefinition["classIdentifier"],
      ),
    );
  }

  const identifierClause = [
    path.call(print, "identifier"),
  ];

  if (arrayDefinition.implicitArrayDimension !== undefined) {
    identifierClause.push(
      path.call(
        print,
        "implicitArrayDimension" as keyof ArrayDefinition[
          "implicitArrayDimension"
        ],
      ),
    );
  }

  if (arrayDefinition.dimensions !== undefined) {
    identifierClause.push(
      path.map(
        print,
        "dimensions" as keyof ArrayDefinition["dimensions"],
      ),
    );
  }

  identifierClause.push(
    getDocWithTrivia(arrayDefinition.semicolonPunctuator),
  );

  elements.push(identifierClause);

  return join(" ", elements);
}

export function printComputedArrayDefinition(
  path: AstPath<ComputedArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const computedArrayDefinition = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(computedArrayDefinition.computedKeyword));
  elements.push(path.call(print, "elementaryType"));

  const identifierClause = [path.call(print, "identifier")];

  identifierClause.push(path.map(print, "dimensions"));

  identifierClause.push(
    getDocWithTrivia(computedArrayDefinition.semicolonPunctuator),
  );

  elements.push(identifierClause);

  return join(" ", elements);
}
