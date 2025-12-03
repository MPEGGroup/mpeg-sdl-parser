import { AstPath, type Doc, doc } from "prettier";
import { addNonBreakingSeparator } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { MapEntry } from "../ast/node/MapEntry.ts";

export function printMapEntry(
  path: AstPath<MapEntry>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const docs: Doc[] = [];

  docs.push([
    path.call(print, "inputValue"),
    path.call(print, "commaPunctuator"),
  ]);

  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "outputValue"));

  return docs;
}
