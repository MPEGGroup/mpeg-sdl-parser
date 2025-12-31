import { AstPath, type Doc } from "prettier";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ForStatement } from "../ast/node/for-statement.ts";

export function printForStatement(
  path: AstPath<ForStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const forStatement = path.node;
  const doc: Doc = [];
  let subDoc: Doc = [];

  doc.push(path.call(print, "forKeyword"));
  addNonBreakingWhitespace(doc);

  subDoc.push(path.call(print, "openParenthesisPunctuator"));

  if (forStatement.expression1 !== undefined) {
    subDoc.push(
      path.call(print, "expression1" as keyof ForStatement["expression1"]),
    );
  } else if (forStatement.computedElementaryDefinition !== undefined) {
    subDoc.push(
      path.call(
        print,
        "computedElementaryDefinition" as keyof ForStatement[
          "computedElementaryDefinition"
        ],
      ),
    );
  } else if (forStatement.semicolon1Punctuator !== undefined) {
    subDoc.push(
      path.call(
        print,
        "semicolon1Punctuator" as keyof ForStatement["semicolon1Punctuator"],
      ),
    );
  }

  if (forStatement.expression2 !== undefined) {
    subDoc = addBreakingWhitespace(subDoc);
    subDoc.push(
      path.call(print, "expression2" as keyof ForStatement["expression2"]),
    );
  }
  subDoc.push(path.call(print, "semicolon2Punctuator"));
  if (forStatement.expression3 !== undefined) {
    subDoc = addBreakingWhitespace(subDoc);
    subDoc.push(
      path.call(print, "expression3" as keyof ForStatement["expression3"]),
    );
  }
  subDoc.push(path.call(print, "closeParenthesisPunctuator"));
  addNonBreakingWhitespace(subDoc);

  doc.push(subDoc);
  doc.push(path.call(print, "statement"));

  return doc;
}
