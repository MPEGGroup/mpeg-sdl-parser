import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { AggregateOutputValue } from "../ast/node/aggregate-output-value.ts";
import {
  addCommaSeparatorsToDoc,
  addNonBreakingSeparator,
} from "./util/print-utils.ts";

export function printAggregateOutputValue(
  path: AstPath<AggregateOutputValue>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const aggregateOutputValue = path.node as AggregateOutputValue;
  const docs = [];

  docs.push(
    path.call(print, "openBracePunctuator"),
  );

  addNonBreakingSeparator(docs);

  const outputValuesDoc = path.map(print, "outputValues");

  docs.push(
    ...addCommaSeparatorsToDoc(
      outputValuesDoc,
      aggregateOutputValue.commaPunctuators,
    ),
  );

  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "closeBracePunctuator"));

  return docs;
}
