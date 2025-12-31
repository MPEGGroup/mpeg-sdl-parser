import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import { addIndentedStatements } from "./util/print-utils.ts";
import type { DefaultClause } from "../ast/node/default-clause.ts";

export function printDefaultClause(
  path: AstPath<DefaultClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const defaultClause = path.node;
  let doc: Doc = [];

  doc.push([
    path.call(print, "defaultKeyword"),
    path.call(print, "colonPunctuator"),
  ]);

  const statementsDoc = path.map(print, "statements");

  if (defaultClause.openBracePunctuator !== undefined) {
    doc.push(" ");
    doc = addIndentedStatements(
      doc,
      statementsDoc,
      path.call(
        print,
        "openBracePunctuator" as keyof DefaultClause["openBracePunctuator"],
      ),
      path.call(
        print,
        "closeBracePunctuator" as keyof DefaultClause["closeBracePunctuator"],
      ),
    );
  } else {
    doc = addIndentedStatements(doc, statementsDoc);
  }

  return doc;
}
