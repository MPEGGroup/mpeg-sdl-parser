import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { AggregateOutputValue } from "../ast/node/aggregate-output-value.ts";
import {
  addNonBreakingWhitespace,
  interleaveCommaSeparatorDocs,
} from "./util/print-utils.ts";

export function printAggregateOutputValue(
  path: AstPath<AggregateOutputValue>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const doc: Doc = [];

  doc.push(
    path.call(print, "openBracePunctuator"),
  );

  addNonBreakingWhitespace(doc);

  const outputValuesDoc = path.map(print, "outputValues");

  doc.push(
    interleaveCommaSeparatorDocs(
      outputValuesDoc,
      path.map(print, "commaPunctuators"),
    ),
  );

  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "closeBracePunctuator"));

  return doc;
}
