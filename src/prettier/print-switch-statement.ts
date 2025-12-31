import { AstPath, type Doc } from "prettier";
import {
  addIndentedStatements,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { SwitchStatement } from "../ast/node/switch-statement.ts";

export function printSwitchStatement(
  path: AstPath<SwitchStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchStatement = path.node;

  const doc: Doc = [];

  doc.push(path.call(print, "switchKeyword"));
  addNonBreakingWhitespace(doc);
  doc.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "expression"),
    path.call(print, "closeParenthesisPunctuator"),
  ]);

  addNonBreakingWhitespace(doc);

  const casesDoc: Doc = [];

  casesDoc.push(
    ...path.map(print, "caseClauses"),
  );

  if (switchStatement.defaultClause !== undefined) {
    casesDoc.push(path.call(
      print,
      "defaultClause" as keyof SwitchStatement["defaultClause"],
    ));
  }

  return addIndentedStatements(
    doc,
    casesDoc,
    path.call(print, "openBracePunctuator"),
    path.call(print, "closeBracePunctuator"),
  );
}
