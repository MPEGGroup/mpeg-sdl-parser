import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { MapDefinition } from "../ast/node/map-definition.ts";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

export function printMapDefinition(
  path: AstPath<MapDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDefinition = path.node;
  let doc: Doc = [];

  if (mapDefinition.reservedKeyword) {
    doc.push(
      path.call(
        print,
        "reservedKeyword" as keyof MapDefinition["reservedKeyword"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  if (mapDefinition.legacyKeyword) {
    doc.push(
      path.call(print, "legacyKeyword" as keyof MapDefinition["legacyKeyword"]),
    );
    addNonBreakingWhitespace(doc);
  }

  if (mapDefinition.elementaryType !== undefined) {
    doc.push(
      path.call(
        print,
        "elementaryType" as keyof MapDefinition["elementaryType"],
      ),
    );
  } else if (mapDefinition.classIdentifier !== undefined) {
    doc.push(
      path.call(
        print,
        "classIdentifier" as keyof MapDefinition["classIdentifier"],
      ),
    );
  }

  doc = addBreakingWhitespace(doc);

  const subDoc: Doc = [];

  subDoc.push(path.call(print, "relationalLessThanPunctuator"));
  subDoc.push(path.call(print, "mapIdentifier"));
  subDoc.push(path.call(print, "relationalGreaterThanPunctuator"));

  doc.push(subDoc);

  doc = addBreakingWhitespace(doc);

  doc.push([
    path.call(print, "identifier"),
    path.call(print, "semicolonPunctuator"),
  ]);

  return doc;
}
