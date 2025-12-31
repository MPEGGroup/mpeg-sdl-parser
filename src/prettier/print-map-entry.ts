import { AstPath, type Doc, doc } from "prettier";
import { addNonBreakingWhitespace } from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { MapEntry } from "../ast/node/map-entry.ts";

export function printMapEntry(
  path: AstPath<MapEntry>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const doc: Doc = [];

  doc.push([
    path.call(print, "inputValue"),
    path.call(print, "commaPunctuator"),
  ]);

  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "outputValue"));

  return doc;
}
