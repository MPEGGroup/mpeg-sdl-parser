import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ForStatement } from "../ast/node/ForStatement.ts";

const { join } = doc.builders;

export function printForStatement(
  path: AstPath<ForStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const forStatement = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(forStatement.forKeyword));

  const subElements = [];

  subElements.push(
    getDocWithTrivia(forStatement.openParenthesisPunctuator),
  );

  if (forStatement.expression1 !== undefined) {
    subElements.push(
      path.call(print, "expression1" as keyof ForStatement["expression1"]),
    );
  } else if (forStatement.computedElementaryDefinition !== undefined) {
    subElements.push(
      path.call(
        print,
        "computedElementaryDefinition" as keyof ForStatement[
          "computedElementaryDefinition"
        ],
      ),
    );
  } else if (forStatement.semicolon1Punctuator !== undefined) {
    subElements.push(getDocWithTrivia(forStatement.semicolon1Punctuator));
  }

  if (forStatement.expression2 !== undefined) {
    subElements.push(" ");
    subElements.push(
      path.call(print, "expression2" as keyof ForStatement["expression2"]),
    );
  }
  subElements.push(getDocWithTrivia(forStatement.semicolon2Punctuator));
  if (forStatement.expression3 !== undefined) {
    subElements.push(" ");
    subElements.push(
      path.call(print, "expression3" as keyof ForStatement["expression3"]),
    );
  }
  subElements.push(
    getDocWithTrivia(forStatement.closeParenthesisPunctuator),
  );

  elements.push(subElements);
  elements.push(path.call(print, "compoundStatement"));

  return join(" ", elements);
}
