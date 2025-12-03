import { AstPath, type Doc, doc } from "prettier";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { DoStatement } from "../ast/node/DoStatement.ts";

const { fill } = doc.builders;

export function printDoStatement(
  path: AstPath<DoStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const docs = [];

  docs.push(path.call(print, "doKeyword"));
  addNonBreakingSeparator(docs);
  docs.push(path.call(print, "compoundStatement"));
  addNonBreakingSeparator(docs);
  docs.push(path.call(print, "whileKeyword"));
  addBreakingSeparator(docs);
  docs.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "condition"),
    path.call(print, "closeParenthesisPunctuator"),
    path.call(print, "semicolonPunctuator"),
  ]);

  return fill(docs);
}
