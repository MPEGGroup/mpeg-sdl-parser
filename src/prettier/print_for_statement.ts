import { AstPath, type Doc } from "prettier";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ForStatement } from "../ast/node/ForStatement.ts";

export function printForStatement(
  path: AstPath<ForStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const forStatement = path.node;
  const docs: Doc[] = [];

  docs.push(path.call(print, "forKeyword"));
  addNonBreakingSeparator(docs);

  const subDocs: Doc[] = [];

  subDocs.push(path.call(print, "openParenthesisPunctuator"));

  if (forStatement.expression1 !== undefined) {
    subDocs.push(
      path.call(print, "expression1" as keyof ForStatement["expression1"]),
    );
  } else if (forStatement.computedElementaryDefinition !== undefined) {
    subDocs.push(
      path.call(
        print,
        "computedElementaryDefinition" as keyof ForStatement[
          "computedElementaryDefinition"
        ],
      ),
    );
  } else if (forStatement.semicolon1Punctuator !== undefined) {
    subDocs.push(
      path.call(
        print,
        "semicolon1Punctuator" as keyof ForStatement["semicolon1Punctuator"],
      ),
    );
  }

  if (forStatement.expression2 !== undefined) {
    addBreakingSeparator(subDocs);
    subDocs.push(
      path.call(print, "expression2" as keyof ForStatement["expression2"]),
    );
  }
  subDocs.push(path.call(print, "semicolon2Punctuator"));
  if (forStatement.expression3 !== undefined) {
    addBreakingSeparator(subDocs);
    subDocs.push(
      path.call(print, "expression3" as keyof ForStatement["expression3"]),
    );
  }
  subDocs.push(path.call(print, "closeParenthesisPunctuator"));
  addNonBreakingSeparator(subDocs);

  docs.push(subDocs);
  docs.push(path.call(print, "statement"));

  return docs;
}
