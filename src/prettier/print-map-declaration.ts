import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { MapDeclaration } from "../ast/node/map-declaration.ts";
import { addIndentedBlock, addNonBreakingSeparator } from "./print-utils.ts";

export function printMapDeclaration(
  path: AstPath<MapDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapDeclaration = path.node;
  const docs = [];

  docs.push(path.call(print, "mapKeyword"));

  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "identifier"));

  addNonBreakingSeparator(docs);

  const subDocs: Doc[] = [
    path.call(print, "openParenthesisPunctuator"),
  ];

  if (mapDeclaration.outputElementaryType !== undefined) {
    subDocs.push(
      path.call(
        print,
        "outputElementaryType" as keyof MapDeclaration["outputElementaryType"],
      ),
    );
  } else if (mapDeclaration.outputClassIdentifier !== undefined) {
    subDocs.push(
      path.call(
        print,
        "outputClassIdentifier" as keyof MapDeclaration[
          "outputClassIdentifier"
        ],
      ),
    );
  }

  subDocs.push(path.call(print, "closeParenthesisPunctuator"));

  docs.push(subDocs);
  addNonBreakingSeparator(docs);

  const entrySubDocs: Doc[] = [];

  for (let i = 0; i < mapDeclaration.mapEntries.length; i++) {
    const entrySubDoc: Doc[] = [];

    entrySubDoc.push(path.call(print, "mapEntries", i));

    if (mapDeclaration.commaPunctuators) {
      if (i < mapDeclaration.commaPunctuators.length) {
        entrySubDoc.push(
          path.call(print, "commaPunctuators", i),
        );
      }
    }

    entrySubDocs.push(entrySubDoc);
  }

  addIndentedBlock(
    docs,
    entrySubDocs,
    mapDeclaration.openBracePunctuator,
    mapDeclaration.closeBracePunctuator,
  );
  return docs;
}
