import { AstPath, type Doc, doc } from "prettier";
import { addNonBreakingSeparator } from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { MapEntry } from "../ast/node/map-entry.ts";

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
