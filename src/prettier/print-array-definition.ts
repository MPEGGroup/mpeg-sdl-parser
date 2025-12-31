import { AstPath, type Doc, doc } from "prettier";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { ArrayDefinition } from "../ast/node/array-definition.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";

const { fill } = doc.builders;

export function printArrayDefinition(
  path: AstPath<ArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const arrayDefinition = path.node;
  let doc: Doc = [];

  if (arrayDefinition.reservedKeyword) {
    doc.push(
      path.call(
        print,
        "reservedKeyword" as keyof ArrayDefinition["reservedKeyword"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  if (arrayDefinition.legacyKeyword) {
    doc.push(
      path.call(
        print,
        "legacyKeyword" as keyof ArrayDefinition["legacyKeyword"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  if (arrayDefinition.alignedModifier !== undefined) {
    doc.push(
      path.call(
        print,
        "alignedModifier" as keyof ArrayDefinition["alignedModifier"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  if (arrayDefinition.elementaryType !== undefined) {
    const subDoc: Doc = [
      path.call(
        print,
        "elementaryType" as keyof ArrayDefinition["elementaryType"],
      ),
      path.call(
        print,
        "lengthAttribute" as keyof ArrayDefinition["lengthAttribute"],
      ),
    ];
    doc.push(subDoc);
  } else {
    doc.push(
      path.call(
        print,
        "classIdentifier" as keyof ArrayDefinition["classIdentifier"],
      ),
    );
  }

  doc = addBreakingWhitespace(doc);

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

  doc.push(identifierClause);

  return fill(doc);
}
