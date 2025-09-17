import { AstPath, type Doc, doc } from "prettier";
import { addCommaSeparatorsToDoc, getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { MapDeclaration } from "../ast/node/MapDeclaration.ts";
import type { MapDefinition } from "../ast/node/MapDefinition.ts";
import type { MapEntry } from "../ast/node/MapEntry.ts";
import type { AggregateOutputValue } from "../ast/node/AggregateOutputValue.ts";
import type { ElementaryTypeOutputValue } from "../ast/node/ElementaryTypeOutputValue.ts";
const { hardline, indent, join } = doc.builders;

export function printElementaryTypeOutputValue(
  path: AstPath<ElementaryTypeOutputValue>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const elements = [];
  elements.push(path.call(print, "elementaryType"));
  elements.push(path.call(print, "lengthAttribute"));
  return join(" ", elements);
}

export function printAggregateOutputValue(
  path: AstPath<AggregateOutputValue>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const aggregateOutputValue = path.node as AggregateOutputValue;
  const elements = [];

  elements.push(
    getDocWithTrivia(aggregateOutputValue.openBracePunctuator),
  );
  elements.push(
    " ",
  );

  const outputValuesDoc = path.map(print, "outputValues");

  elements.push(
    ...addCommaSeparatorsToDoc(
      outputValuesDoc,
      aggregateOutputValue.commaPunctuators,
    ),
  );

  elements.push(
    " ",
  );
  elements.push(
    getDocWithTrivia(aggregateOutputValue.closeBracePunctuator),
  );

  return elements;
}

export function printMapDeclaration(
  path: AstPath<MapDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDeclaration = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(mapDeclaration.mapKeyword));
  elements.push(path.call(print, "identifier"));

  const subElements: Doc[] = [
    getDocWithTrivia(mapDeclaration.openParenthesisPunctuator),
  ];

  if (mapDeclaration.outputElementaryType !== undefined) {
    subElements.push(
      path.call(
        print,
        "outputElementaryType" as keyof MapDeclaration["outputElementaryType"],
      ),
    );
  } else if (mapDeclaration.outputClassIdentifier !== undefined) {
    subElements.push(
      path.call(
        print,
        "outputClassIdentifier" as keyof MapDeclaration[
          "outputClassIdentifier"
        ],
      ),
    );
  }

  subElements.push(
    getDocWithTrivia(mapDeclaration.closeParenthesisPunctuator),
  );

  elements.push(subElements);

  const entrySubElements: Doc[] = [];
  const outputValuesDoc = path.map(print, "mapEntries");

  entrySubElements.push(
    ...addCommaSeparatorsToDoc(
      outputValuesDoc,
      mapDeclaration.commaPunctuators,
    ),
  );

  const entries: Doc[] = [
    getDocWithTrivia(mapDeclaration.openBracePunctuator),
    indent([
      hardline,
      join(hardline, entrySubElements),
    ]),
    hardline,
    getDocWithTrivia(mapDeclaration.closeBracePunctuator),
  ];
  elements.push(entries);

  return join(" ", elements);
}

export function printMapDefinition(
  path: AstPath<MapDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDefinition = path.node;
  const elements = [];

  if (mapDefinition.isReserved) {
    elements.push(getDocWithTrivia(mapDefinition.reservedKeyword!));
  }
  if (mapDefinition.isLegacy) {
    elements.push(getDocWithTrivia(mapDefinition.legacyKeyword!));
  }

  const subElements = [];

  if (mapDefinition.elementaryType !== undefined) {
    subElements.push(
      path.call(
        print,
        "elementaryType" as keyof MapDefinition["elementaryType"],
      ),
    );
  } else if (mapDefinition.classIdentifier !== undefined) {
    subElements.push(
      path.call(
        print,
        "classIdentifier" as keyof MapDefinition["classIdentifier"],
      ),
    );
  }

  subElements.push(
    getDocWithTrivia(mapDefinition.openParenthesisPunctuator),
  );
  subElements.push(path.call(print, "mapIdentifier"));
  subElements.push(
    getDocWithTrivia(mapDefinition.closeParenthesisPunctuator),
  );

  elements.push(subElements);
  elements.push([
    path.call(print, "identifier"),
    getDocWithTrivia(mapDefinition.semicolonPunctuator),
  ]);
  return join(" ", elements);
}

export function printMapEntry(
  path: AstPath<MapEntry>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const mapEntry = path.node;
  const elements = [];
  elements.push([
    path.call(print, "inputValue"),
    getDocWithTrivia(mapEntry.commaPunctuator),
  ]);
  elements.push(
    path.call(
      print,
      "outputValue",
    ),
  );
  return join(" ", elements);
}
