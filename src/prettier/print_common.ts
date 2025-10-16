import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { AlignedModifier } from "../ast/node/AlignedModifier.ts";
import { NumberLiteralKind } from "../ast/node/enum/number_literal_kind.ts";
import type { LengthAttribute } from "../ast/node/LengthAttribute.ts";
import type { NumberLiteral } from "../ast/node/NumberLiteral.ts";
import type { Identifier } from "../ast/node/Identifier.ts";
const { join } = doc.builders;

export function printAlignedModifier(
  path: AstPath<AlignedModifier>,
): Doc {
  const alignedModifier = path.node;

  const elements = [];

  elements.push(getDocWithTrivia(alignedModifier.alignedKeyword));

  if (!alignedModifier.isDefault8BitCount) {
    elements.push(
      getDocWithTrivia(alignedModifier.openParenthesisPunctuator!),
    );
    elements.push(
      getDocWithTrivia(alignedModifier.bitCountModifierToken!),
    ),
      elements.push(
        getDocWithTrivia(alignedModifier.closeParenthesisPunctuator!),
      );
  }
  return elements;
}

export function printIdentifier(path: AstPath<Identifier>): Doc {
  const identifier = path.node;

  return getDocWithTrivia(identifier.literal);
}

export function printLengthAttribute(
  path: AstPath<LengthAttribute>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return [
    getDocWithTrivia(node.openParenthesisPunctuator),
    path.call(print, "length"),
    getDocWithTrivia(node.closeParenthesisPunctuator),
  ];
}

export function printMultipleCharacterNumberLiteral(
  path: AstPath<NumberLiteral>,
): Doc {
  const multipleCharacterNumberLiteral = path.node;

  const multipleCharacterNumberLiterals = [];
  let opened = false;
  let currentLiteral = [] as Doc[];
  let containsContent = false;

  for (const literal of multipleCharacterNumberLiteral.literals) {
    if (literal.text === "'") {
      if (!opened) {
        currentLiteral.push(...getDocWithTrivia(literal));
        opened = true;
      } else {
        currentLiteral.push(...getDocWithTrivia(literal));

        // avoid empty multiple character number literals after the first one
        if ((multipleCharacterNumberLiterals.length === 0) || containsContent) {
          multipleCharacterNumberLiterals.push(currentLiteral);
        }

        // reset state
        currentLiteral = [];
        containsContent = false;
        opened = false;
      }
    } else if (literal.text.length > 0) {
      currentLiteral.push(literal.text);
      containsContent = true;
    }
  }

  return join(
    " ",
    multipleCharacterNumberLiterals,
  );
}

export function printNumberLiteral(path: AstPath<NumberLiteral>): Doc {
  const numberLiteral = path.node;
  const numberLiteralKind = numberLiteral.numberLiteralKind;

  switch (numberLiteralKind) {
    case NumberLiteralKind.BINARY:
    case NumberLiteralKind.HEXADECIMAL:
    case NumberLiteralKind.INTEGER:
    case NumberLiteralKind.DECIMAL:
    case NumberLiteralKind.FLOATING_POINT:
      return getDocWithTrivia(numberLiteral.literals[0]);
    case NumberLiteralKind.MULTIPLE_CHARACTER:
      return printMultipleCharacterNumberLiteral(path);
    default: {
      const exhaustiveCheck: never = numberLiteralKind;
      throw new Error(
        "Unreachable code reached, numberLiteralKind == " + exhaustiveCheck,
      );
    }
  }
}
