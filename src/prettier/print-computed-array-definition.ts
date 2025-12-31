import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ComputedArrayDefinition } from "../ast/node/computed-array-definition.ts";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

const { fill } = doc.builders;

export function printComputedArrayDefinition(
  path: AstPath<ComputedArrayDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  let doc: Doc = [];

  doc.push(path.call(print, "computedKeyword"));

  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "elementaryType"));

  doc = addBreakingWhitespace(doc);

  const identifierClause = [path.call(print, "identifier")];

  identifierClause.push(path.map(print, "dimensions"));
  identifierClause.push(path.call(print, "semicolonPunctuator"));

  doc.push(identifierClause);

  return fill(doc);
}
