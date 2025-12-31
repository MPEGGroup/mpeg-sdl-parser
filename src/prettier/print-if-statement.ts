import { AstPath, type Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { IfStatement } from "../ast/node/if-statement.ts";
import {
  addIndentedStatements,
  addNonBreakingWhitespace,
  addTrailingHardline,
} from "./util/print-utils.ts";
import { StatementKind } from "../ast/node/enum/statement-kind.ts";
import { isStatement } from "../ast/util/types.ts";

export function printIfStatement(
  path: AstPath<IfStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const ifStatement = path.node;

  let doc: Doc = [];

  doc.push(path.call(print, "ifKeyword"));
  addNonBreakingWhitespace(doc);

  doc.push([
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "condition"),
    path.call(print, "closeParenthesisPunctuator"),
  ]);

  addNonBreakingWhitespace(doc);

  const ifSubStatement = ifStatement.ifStatement;
  if (
    isStatement(ifSubStatement) &&
    (ifSubStatement.statementKind === StatementKind.COMPOUND)
  ) {
    doc.push(path.call(print, "ifStatement"));
  } else {
    doc = addIndentedStatements(doc, [path.call(print, "ifStatement")]);
  }

  if (ifStatement.elseKeyword === undefined) {
    return doc;
  }

  doc = addTrailingHardline(doc);

  if (!Array.isArray(doc)) {
    doc = [doc];
  }

  doc.push(
    path.call(print, "elseKeyword" as keyof IfStatement["elseKeyword"]),
  );
  addNonBreakingWhitespace(doc);

  const elseSubStatement = ifStatement.elseStatement!;
  if (
    isStatement(elseSubStatement) &&
    (elseSubStatement.statementKind !== StatementKind.COMPOUND) &&
    (elseSubStatement.statementKind !== StatementKind.IF)
  ) {
    doc = addIndentedStatements(
      doc,
      [path.call(
        print,
        "elseStatement" as keyof IfStatement["elseStatement"],
      )],
    );
  } else {
    doc.push(
      path.call(print, "elseStatement" as keyof IfStatement["elseStatement"]),
    );
  }

  return doc;
}
