import { AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { IfStatement } from "../ast/node/IfStatement.ts";
import { getDocWithTrivia } from "./print_utils.ts";
import { StatementKind } from "../ast/node/enum/statement_kind.ts";

const { hardline, indent, join } = doc.builders;

export function printIfStatement(
  path: AstPath<IfStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const ifStatement = path.node;

  const elements = [];

  elements.push(getDocWithTrivia(ifStatement.ifKeyword));

  const subElements = [];

  subElements.push(
    getDocWithTrivia(ifStatement.openParenthesisPunctuator),
    path.call(print, "condition"),
    getDocWithTrivia(ifStatement.closeParenthesisPunctuator),
  );

  elements.push(subElements);

  const ifSubStatement = ifStatement.ifStatement;
  if (ifSubStatement.statementKind !== StatementKind.COMPOUND) {
    elements.push(indent([hardline, path.call(print, "ifStatement")]));
  } else {
    elements.push(path.call(print, "ifStatement"));
  }

  if (ifStatement.elseKeyword !== undefined) {
    elements.push([hardline, getDocWithTrivia(ifStatement.elseKeyword)]);
    const elseSubStatement = ifStatement.elseStatement!;
    if (elseSubStatement.statementKind === StatementKind.IF) {
      elements.push(
        path.call(
          print,
          "elseStatement" as keyof IfStatement["elseStatement"],
        ),
      );
    } else if (elseSubStatement.statementKind !== StatementKind.COMPOUND) {
      elements.push(indent(
        [
          hardline,
          path.call(
            print,
            "elseStatement" as keyof IfStatement["elseStatement"],
          ),
        ],
      ));
    } else {
      elements.push(
        path.call(print, "elseStatement" as keyof IfStatement["elseStatement"]),
      );
    }
  }

  return join(" ", elements);
}
