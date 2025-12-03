import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { MapDefinition } from "../ast/node/MapDefinition.ts";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print_utils.ts";

export function printMapDefinition(
  path: AstPath<MapDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDefinition = path.node;
  const docs = [];

  if (mapDefinition.reservedKeyword) {
    docs.push(
      path.call(
        print,
        "reservedKeyword" as keyof MapDefinition["reservedKeyword"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  if (mapDefinition.legacyKeyword) {
    docs.push(
      path.call(print, "legacyKeyword" as keyof MapDefinition["legacyKeyword"]),
    );
    addNonBreakingSeparator(docs);
  }

  if (mapDefinition.elementaryType !== undefined) {
    docs.push(
      path.call(
        print,
        "elementaryType" as keyof MapDefinition["elementaryType"],
      ),
    );
  } else if (mapDefinition.classIdentifier !== undefined) {
    docs.push(
      path.call(
        print,
        "classIdentifier" as keyof MapDefinition["classIdentifier"],
      ),
    );
  }

  addBreakingSeparator(docs);

  const subDocs: Doc[] = [];

  subDocs.push(path.call(print, "relationalLessThanPunctuator"));
  subDocs.push(path.call(print, "mapIdentifier"));
  subDocs.push(path.call(print, "relationalGreaterThanPunctuator"));

  docs.push(subDocs);

  addBreakingSeparator(docs);

  docs.push([
    path.call(print, "identifier"),
    path.call(print, "semicolonPunctuator"),
  ]);

  return docs;
}
