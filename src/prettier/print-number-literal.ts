import { type AstPath, type Doc, doc } from "prettier";
import { NumberLiteralKind } from "../ast/node/enum/number-literal-kind.ts";
import type { NumberLiteral } from "../ast/node/number-literal.ts";
import type { Token } from "../ast/node/token.ts";
import { isMissingError, isUnexpectedError } from "../ast/util/types.ts";
import type { AbstractNode } from "../../index.ts";

const { join } = doc.builders;

function printMultipleCharacterNumberLiteral(
  path: AstPath<NumberLiteral>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const multipleCharacterNumberLiteral = path.node;

  const multipleCharacterNumberLiterals: Doc[] = [];
  let currentLiteral: Doc[] = [];
  let opened = false;
  let containsContent = false;

  multipleCharacterNumberLiteral.literals.forEach((literal, index) => {
    if (isMissingError(literal)) {
      return;
    }
    if (isUnexpectedError(literal)) {
      currentLiteral.push(path.call(print, "literals", index));
      return;
    }
    const literalToken = literal as Token;
    if (literalToken.text === "'") {
      if (!opened) {
        currentLiteral.push(path.call(print, "literals", index));
        opened = true;
      } else {
        currentLiteral.push(path.call(print, "literals", index));

        // avoid empty multiple character number literals after the first one
        if ((multipleCharacterNumberLiterals.length === 0) || containsContent) {
          multipleCharacterNumberLiterals.push(currentLiteral);
        }

        // reset state
        currentLiteral = [];
        containsContent = false;
        opened = false;
      }
    } else if (literalToken.text.length > 0) {
      currentLiteral.push(literalToken.text);
      containsContent = true;
    }
  });

  return join(
    " ",
    multipleCharacterNumberLiterals,
  );
}
export function printNumberLiteral(
  path: AstPath<NumberLiteral>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const numberLiteral = path.node;
  const numberLiteralKind = numberLiteral.numberLiteralKind;

  switch (numberLiteralKind) {
    case NumberLiteralKind.BINARY:
    case NumberLiteralKind.HEXADECIMAL:
    case NumberLiteralKind.INTEGER:
    case NumberLiteralKind.DECIMAL:
    case NumberLiteralKind.FLOATING_POINT:
      return path.call(print, "literals", 0);
    case NumberLiteralKind.MULTIPLE_CHARACTER:
      return printMultipleCharacterNumberLiteral(path, print);
    default: {
      const exhaustiveCheck: never = numberLiteralKind;
      throw new Error(
        "Unreachable code reached, numberLiteralKind == " + exhaustiveCheck,
      );
    }
  }
}
