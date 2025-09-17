import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { StringDefinition } from "../ast/node/StringDefinition.ts";
import type { StringLiteral } from "../ast/node/StringLiteral.ts";
const { join } = doc.builders;

export function printStringDefinition(
  path: AstPath<StringDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const stringDefinition = path.node;

  const elements = [];

  if (stringDefinition.isReserved) {
    elements.push(getDocWithTrivia(stringDefinition.reservedKeyword!));
  }
  if (stringDefinition.isLegacy) {
    elements.push(getDocWithTrivia(stringDefinition.legacyKeyword!));
  }
  if (stringDefinition.isConst) {
    elements.push(getDocWithTrivia(stringDefinition.constKeyword!));
  }

  if (stringDefinition.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof StringDefinition["alignedModifier"],
      ),
    );
  }
  elements.push(getDocWithTrivia(stringDefinition.stringVariableKindToken));
  elements.push(path.call(print, "identifier"));

  if (stringDefinition.assignmentPunctuator !== undefined) {
    elements.push(getDocWithTrivia(stringDefinition.assignmentPunctuator));
    elements.push(
      path.call(
        print,
        "stringLiteral" as keyof StringDefinition["stringLiteral"],
      ),
    );
  }

  return [
    join(" ", elements),
    getDocWithTrivia(stringDefinition.semicolonPunctuator),
  ];
}

export function printStringLiteral(
  path: AstPath<StringLiteral>,
): Doc {
  const stringLiteral = path.node;

  const stringLiterals = [];
  let opened = false;
  let currentLiteral = [] as Doc[];
  let containsContent = false;

  for (const literal of stringLiteral.literals) {
    if (literal.text === '"') {
      if (!opened) {
        currentLiteral.push(...getDocWithTrivia(literal));
        opened = true;
      } else {
        currentLiteral.push(...getDocWithTrivia(literal));

        // avoid empty string literals after the first one
        if ((stringLiterals.length === 0) || containsContent) {
          stringLiterals.push(currentLiteral);
        }

        // reset state
        currentLiteral = [];
        containsContent = false;
        opened = false;
      }
    } else if (literal.text === "u") {
      if (opened) {
        currentLiteral.push(literal.text);
        containsContent = true;
      } else {
        currentLiteral.push(...getDocWithTrivia(literal));
      }
    } else if (literal.text.length > 0) {
      currentLiteral.push(literal.text);
      containsContent = true;
    }
  }

  return join(
    " ",
    stringLiterals,
  );
}
