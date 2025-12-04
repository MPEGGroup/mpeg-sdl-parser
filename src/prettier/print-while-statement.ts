import { AstPath, type Doc } from "prettier";
import { addNonBreakingSeparator } from "./print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { WhileStatement } from "../ast/node/while-statement.ts";

export function printWhileStatement(
  path: AstPath<WhileStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const docs = [];

  docs.push(
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "whileKeyword"),
  );
  addNonBreakingSeparator(docs);

  docs.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "condition"),
    path.call(print, "closeParenthesisPunctuator"),
  ]);

  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "compoundStatement"));

  return docs;
}
