import { AstPath, type Doc } from "prettier";
import { addNonBreakingWhitespace } from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { WhileStatement } from "../ast/node/while-statement.ts";

export function printWhileStatement(
  path: AstPath<WhileStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const doc: Doc = [];

  doc.push(path.call(print, "whileKeyword"));
  addNonBreakingWhitespace(doc);

  doc.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "condition"),
    path.call(print, "closeParenthesisPunctuator"),
  ]);

  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "compoundStatement"));

  return doc;
}
