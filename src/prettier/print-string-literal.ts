import { AstPath, type Doc } from "prettier";
import type { StringLiteral } from "../ast/node/string-literal.ts";
import { isMissingError, isUnexpectedError } from "../ast/util/types.ts";
import type { AbstractNode, Token } from "../../index.ts";

export function printStringLiteral(
  path: AstPath<StringLiteral>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const stringLiteral = path.node;

  const doc: Doc = [];
  let currentLiteralDoc: Doc[] = [];
  let opened = false;
  let containsContent = false;

  stringLiteral.literals.forEach((literal, index) => {
    if (isMissingError(literal)) {
      return;
    }
    if (isUnexpectedError(literal)) {
      currentLiteralDoc.push(path.call(print, "literals", index));
      return;
    }
    const literalToken = literal as Token;

    if (literalToken.text === '"') {
      if (!opened) {
        currentLiteralDoc.push(path.call(print, "literals", index));
        opened = true;
      } else {
        currentLiteralDoc.push(path.call(print, "literals", index));

        // skip any empty literals after the first literal
        if ((doc.length === 0) || containsContent) {
          doc.push(currentLiteralDoc.join(""));
        }

        // reset state
        currentLiteralDoc = [];
        containsContent = false;
        opened = false;
      }
    } else if (literalToken.text === "u") {
      if (opened) {
        currentLiteralDoc.push(literalToken.text);
        containsContent = true;
      } else {
        currentLiteralDoc.push(path.call(print, "literals", index));
      }
    } else if (literalToken.text.length > 0) {
      currentLiteralDoc.push(literalToken.text);
      containsContent = true;
    }
  });
  return doc;
}
