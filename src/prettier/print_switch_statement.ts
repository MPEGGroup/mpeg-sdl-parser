import { AstPath, type Doc } from "prettier";
import { addIndentedBlock, addNonBreakingSeparator } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { SwitchStatement } from "../ast/node/SwitchStatement.ts";

export function printSwitchStatement(
  path: AstPath<SwitchStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchStatement = path.node;

  const docs = [];

  docs.push(path.call(print, "switchKeyword"));
  addNonBreakingSeparator(docs);

  docs.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "expression"),
    path.call(print, "closeParenthesisPunctuator"),
  ]);

  addNonBreakingSeparator(docs);

  const caseDocs: Doc[] = [];

  caseDocs.push(
    ...path.map(print, "caseClauses"),
  );

  if (switchStatement.defaultClause !== undefined) {
    caseDocs.push(path.call(
      print,
      "defaultClause" as keyof SwitchStatement["defaultClause"],
    ));
  }

  addIndentedBlock(
    docs,
    caseDocs,
    switchStatement.openBracePunctuator,
    switchStatement.closeBracePunctuator,
  );

  return docs;
}
