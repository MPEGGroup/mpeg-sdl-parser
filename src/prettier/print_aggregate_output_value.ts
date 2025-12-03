import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { AggregateOutputValue } from "../ast/node/AggregateOutputValue.ts";
import {
  addCommaSeparatorsToDoc,
  addNonBreakingSeparator,
} from "./print_utils.ts";

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
