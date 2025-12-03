import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import {
  addIndentedBlock,
  addIndentedStatements,
  addNonBreakingSeparator,
  removeLeadingBlankline,
} from "./print_utils.ts";
import type { CaseClause } from "../ast/node/CaseClause.ts";

export function printCaseClause(
  path: AstPath<CaseClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const caseClause = path.node;

  const docs: Doc[] = [];

  docs.push(path.call(print, "caseKeyword"));
  addNonBreakingSeparator(docs);

  docs.push([
    path.call(print, "value"),
    path.call(print, "colonPunctuator"),
  ]);

  const statementDocs = [];

  if (caseClause.statements.length > 0) {
    statementDocs.push(...path.map(print, "statements"));
  }

  if (caseClause.breakKeyword !== undefined) {
    statementDocs.push([
      path.call(print, "breakKeyword" as keyof CaseClause["breakKeyword"]),
      path.call(
        print,
        "semicolonPunctuator" as keyof CaseClause["semicolonPunctuator"],
      ),
    ]);
  }

  if (caseClause.openBracePunctuator !== undefined) {
    docs.push(" ");
    addIndentedBlock(
      docs,
      statementDocs,
      caseClause.openBracePunctuator,
      caseClause.closeBracePunctuator!,
    );
  } else {
    removeLeadingBlankline(statementDocs);
    addIndentedStatements(docs, statementDocs);
  }

  return docs;
}
