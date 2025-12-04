import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ComputedArrayDefinition } from "../ast/node/computed-array-definition.ts";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print-utils.ts";

const { fill } = doc.builders;

export function printComputedArrayDefinition(
  path: AstPath<ComputedArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const docs = [];

  docs.push(path.call(print, "computedKeyword"));

  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "elementaryType"));

  addBreakingSeparator(docs);

  const identifierClause = [path.call(print, "identifier")];

  identifierClause.push(path.map(print, "dimensions"));
  identifierClause.push(path.call(print, "semicolonPunctuator"));

  docs.push(identifierClause);

  return fill(docs);
}
