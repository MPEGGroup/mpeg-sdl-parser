import { AstPath, type Doc, doc } from "prettier";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { DoStatement } from "../ast/node/do-statement.ts";

const { fill } = doc.builders;

export function printDoStatement(
  path: AstPath<DoStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  let doc: Doc = [];

  doc.push(path.call(print, "doKeyword"));
  addNonBreakingWhitespace(doc);
  doc.push(path.call(print, "compoundStatement"));
  addNonBreakingWhitespace(doc);
  doc.push(path.call(print, "whileKeyword"));
  doc = addBreakingWhitespace(doc);
  doc.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "condition"),
    path.call(print, "closeParenthesisPunctuator"),
    path.call(print, "semicolonPunctuator"),
  ]);

  return fill(doc);
}
