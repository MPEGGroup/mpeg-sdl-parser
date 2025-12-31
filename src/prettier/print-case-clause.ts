import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import {
  addIndentedStatements,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { CaseClause } from "../ast/node/case-clause.ts";

export function printCaseClause(
  path: AstPath<CaseClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const caseClause = path.node;
  let doc: Doc = [];

  doc.push(path.call(print, "caseKeyword"));
  addNonBreakingWhitespace(doc);

  doc.push([
    path.call(print, "value"),
    path.call(print, "colonPunctuator"),
  ]);

  const statementsDocs: Doc[] = [];

  if (caseClause.statements.length > 0) {
    statementsDocs.push(path.map(print, "statements"));
  }
  if (caseClause.breakKeyword !== undefined) {
    statementsDocs.push([[
      path.call(print, "breakKeyword" as keyof CaseClause["breakKeyword"]),
      path.call(
        print,
        "semicolonPunctuator" as keyof CaseClause["semicolonPunctuator"],
      ),
    ]]);
  }

  if (caseClause.openBracePunctuator !== undefined) {
    doc.push(" ");
    doc = addIndentedStatements(
      doc,
      statementsDocs,
      path.call(
        print,
        "openBracePunctuator" as keyof CaseClause["openBracePunctuator"],
      ),
      path.call(
        print,
        "closeBracePunctuator" as keyof CaseClause["closeBracePunctuator"],
      ),
    );
  } else {
    doc = addIndentedStatements(doc, statementsDocs);
  }

  return doc;
}
