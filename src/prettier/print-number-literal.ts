import { type AstPath, type Doc, doc } from "prettier";
import { NumberLiteralKind } from "../ast/node/enum/number-literal-kind.ts";
import type { NumberLiteral } from "../ast/node/number-literal.ts";
import type { Token } from "../ast/node/token.ts";
import { isMissingError, isUnexpectedError } from "../ast/util/types.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import { InternalParseError } from "../parse-error.ts";

const { join } = doc.builders;

function printMultipleCharacterNumberLiteral(
  path: AstPath<NumberLiteral>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const multipleCharacterNumberLiteral = path.node;

  const multipleCharacterNumberLiteralsDoc: Doc = [];
  let currentLiterals: Doc[] = [];
  let opened = false;
  let containsContent = false;

  multipleCharacterNumberLiteral.literals.forEach((literal, index) => {
    if (isMissingError(literal)) {
      return;
    }
    if (isUnexpectedError(literal)) {
      currentLiterals.push(path.call(print, "literals", index));
      return;
    }
    const literalToken = literal as Token;
    if (literalToken.text === "'") {
      if (!opened) {
        currentLiterals.push(path.call(print, "literals", index));
        opened = true;
      } else {
        currentLiterals.push(path.call(print, "literals", index));

        // avoid empty multiple character number literals after the first one
        if (
          (multipleCharacterNumberLiteralsDoc.length === 0) || containsContent
        ) {
          multipleCharacterNumberLiteralsDoc.push(currentLiterals);
        }

        // reset state
        currentLiterals = [];
        containsContent = false;
        opened = false;
      }
    } else if (literalToken.text.length > 0) {
      currentLiterals.push(literalToken.text);
      containsContent = true;
    }
  });

  return join(
    " ",
    multipleCharacterNumberLiteralsDoc,
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
      throw new InternalParseError(
        "Unreachable code reached, numberLiteralKind == " + exhaustiveCheck,
      );
    }
  }
}
