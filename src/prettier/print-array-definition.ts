import { AstPath, type Doc, doc } from "prettier";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./util/print-utils.ts";
import type { ArrayDefinition } from "../ast/node/array-definition.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";

const { fill } = doc.builders;

export function printArrayDefinition(
  path: AstPath<ArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const arrayDefinition = path.node;

  const docs = [];

  if (arrayDefinition.reservedKeyword) {
    docs.push(
      path.call(
        print,
        "reservedKeyword" as keyof ArrayDefinition["reservedKeyword"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  if (arrayDefinition.legacyKeyword) {
    docs.push(
      path.call(
        print,
        "legacyKeyword" as keyof ArrayDefinition["legacyKeyword"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  if (arrayDefinition.alignedModifier !== undefined) {
    docs.push(
      path.call(
        print,
        "alignedModifier" as keyof ArrayDefinition["alignedModifier"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  if (arrayDefinition.elementaryType !== undefined) {
    const subDocs = [
      path.call(
        print,
        "elementaryType" as keyof ArrayDefinition["elementaryType"],
      ),
      path.call(
        print,
        "lengthAttribute" as keyof ArrayDefinition["lengthAttribute"],
      ),
    ];
    docs.push(subDocs);
  } else {
    docs.push(
      path.call(
        print,
        "classIdentifier" as keyof ArrayDefinition["classIdentifier"],
      ),
    );
  }

  addBreakingSeparator(docs);

  const identifierClause = [
    path.call(print, "identifier"),
  ];

  if (arrayDefinition.implicitArrayDimension) {
    identifierClause.push(
      path.call(
        print,
        "implicitArrayDimension" as keyof ArrayDefinition[
          "implicitArrayDimension"
        ],
      ),
    );
  }

  if (arrayDefinition.dimensions) {
    identifierClause.push(...path.map(print, "dimensions"));
  }

  identifierClause.push(path.call(print, "semicolonPunctuator"));

  docs.push(identifierClause);

  return fill(docs);
}
