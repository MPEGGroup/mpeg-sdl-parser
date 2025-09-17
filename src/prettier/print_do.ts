import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { DoStatement } from "../ast/node/DoStatement.ts";
const { join } = doc.builders;

export function printDoStatement(
  path: AstPath<DoStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const doStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(doStatement.doKeyword));
  elements.push(path.call(print, "compoundStatement"));
  elements.push(getDocWithTrivia(doStatement.whileKeyword));
  elements.push([
    getDocWithTrivia(doStatement.openParenthesisPunctuator),
    path.call(print, "condition"),
    getDocWithTrivia(doStatement.closeParenthesisPunctuator),
    getDocWithTrivia(doStatement.semicolonPunctuator),
  ]);

  return join(" ", elements);
}
