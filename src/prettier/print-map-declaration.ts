import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { MapDeclaration } from "../ast/node/map-declaration.ts";
import {
  addIndentedStatements,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

export function printMapDeclaration(
  path: AstPath<MapDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDeclaration = path.node;
  const doc: Doc = [];

  doc.push(path.call(print, "mapKeyword"));

  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "identifier"));

  addNonBreakingWhitespace(doc);

  const subDoc: Doc = [
    path.call(print, "openParenthesisPunctuator"),
  ];

  if (mapDeclaration.outputElementaryType !== undefined) {
    subDoc.push(
      path.call(
        print,
        "outputElementaryType" as keyof MapDeclaration["outputElementaryType"],
      ),
    );
  } else if (mapDeclaration.outputClassIdentifier !== undefined) {
    subDoc.push(
      path.call(
        print,
        "outputClassIdentifier" as keyof MapDeclaration[
          "outputClassIdentifier"
        ],
      ),
    );
  }

  subDoc.push(path.call(print, "closeParenthesisPunctuator"));

  doc.push(subDoc);
  addNonBreakingWhitespace(doc);

  const entriesSubDoc: Doc = [];

  for (let i = 0; i < mapDeclaration.mapEntries.length; i++) {
    const entrySubDoc: Doc = [];

    entrySubDoc.push(path.call(print, "mapEntries", i));

    if (mapDeclaration.commaPunctuators) {
      if (i < mapDeclaration.commaPunctuators.length) {
        entrySubDoc.push(
          path.call(print, "commaPunctuators", i),
        );
      }
    }

    entriesSubDoc.push(entrySubDoc);
  }

  return addIndentedStatements(
    doc,
    entriesSubDoc,
    path.call(print, "openBracePunctuator"),
    path.call(print, "closeBracePunctuator"),
  );
}
