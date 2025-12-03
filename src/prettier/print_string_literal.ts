import { AstPath, type Doc } from "prettier";
import type { StringLiteral } from "../ast/node/StringLiteral.ts";
import { isMissingError, isUnexpectedError } from "../ast/util/types.ts";
import type { AbstractNode, Token } from "../../index.ts";

export function printStringLiteral(
  path: AstPath<StringLiteral>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc[] {
  const stringLiteral = path.node;

  const docs: Doc[] = [];
  let currentLiteral: Doc[] = [];
  let opened = false;
  let containsContent = false;

  stringLiteral.literals.forEach((literal, index) => {
    if (isMissingError(literal)) {
      return;
    }
    if (isUnexpectedError(literal)) {
      currentLiteral.push(path.call(print, "literals", index));
      return;
    }
    const literalToken = literal as Token;
    if (literalToken.text === '"') {
      if (!opened) {
        currentLiteral.push(path.call(print, "literals", index));
        opened = true;
      } else {
        currentLiteral.push(path.call(print, "literals", index));

        // avoid empty string literals after the first one
        if ((docs.length === 0) || containsContent) {
          docs.push(currentLiteral);
        }

        // reset state
        currentLiteral = [];
        containsContent = false;
        opened = false;
      }
    } else if (literalToken.text === "u") {
      if (opened) {
        currentLiteral.push(literalToken.text);
        containsContent = true;
      } else {
        currentLiteral.push(path.call(print, "literals", index));
      }
    } else if (literalToken.text.length > 0) {
      currentLiteral.push(literalToken.text);
      containsContent = true;
    }
  });

  return docs;
}
