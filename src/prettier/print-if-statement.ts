import { AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { IfStatement } from "../ast/node/if-statement.ts";
import {
  addIfNoTrailingHardline,
  addIndentedStatements,
  addNonBreakingSeparator,
} from "./util/print-utils.ts";
import { StatementKind } from "../ast/node/enum/statement-kind.ts";
import { isStatement } from "../ast/util/types.ts";

const { hardline } = doc.builders;

export function printIfStatement(
  path: AstPath<IfStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const ifStatement = path.node;

  const docs = [];

  docs.push(path.call(print, "ifKeyword"));
  addNonBreakingSeparator(docs);

  docs.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "condition"),
    path.call(print, "closeParenthesisPunctuator"),
  ]);

  addNonBreakingSeparator(docs);

  const ifSubStatement = ifStatement.ifStatement;

  if (
    isStatement(ifSubStatement) &&
    (ifSubStatement.statementKind !== StatementKind.COMPOUND)
  ) {
    addIndentedStatements(docs, [path.call(print, "ifStatement")]);
  } else {
    docs.push(path.call(print, "ifStatement"));
  }

  if (ifStatement.elseKeyword !== undefined) {
    addIfNoTrailingHardline(docs, hardline);
    docs.push(
      path.call(print, "elseKeyword" as keyof IfStatement["elseKeyword"]),
    );
    addNonBreakingSeparator(docs);

    const elseSubStatement = ifStatement.elseStatement!;
    if (
      isStatement(elseSubStatement) &&
      (elseSubStatement.statementKind !== StatementKind.COMPOUND)
    ) {
      addIndentedStatements(
        docs,
        [path.call(
          print,
          "elseStatement" as keyof IfStatement["elseStatement"],
        )],
      );
    } else {
      docs.push(
        path.call(print, "elseStatement" as keyof IfStatement["elseStatement"]),
      );
    }
  }

  return docs;
}
