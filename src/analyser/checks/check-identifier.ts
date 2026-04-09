import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { Check, CheckResult } from "./check.ts";

// Build set of SDL keywords and literal prefixes
const getReservedIdentifiers = (): Set<string> => {
  // Add SDL keywords from token mapping
  const reserved = new Set([
    "abstract",
    "aligned",
    "base64string",
    "bit",
    "break",
    "case",
    "class",
    "computed",
    "const",
    "default",
    "do",
    "else",
    "expandable",
    "extends",
    "float",
    "for",
    "if",
    "int",
    "legacy",
    "lengthof",
    "map",
    "reserved",
    "switch",
    "unsigned",
    "utf8string",
    "utf16string",
    "utfstring",
    "utf8list",
    "while",
  ]);

  // Add literal prefixes
  reserved.add("0b");
  reserved.add("0x");

  return reserved;
};

const reservedIdentifiers = getReservedIdentifiers();

export const checkIdentifier: Check = {
  nodeKind: NodeKind.IDENTIFIER,
  checkFunc: function (
    node: Identifier,
    _symbolTable,
    _strict,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    const identifierName = node.name.toLowerCase();

    if (reservedIdentifiers.has(identifierName)) {
      results.push({
        message:
          "It is illegal to define an identifier which conflicts (ignoring case) with SDL syntax items such as keywords, binary, hexadecimal and string literal prefixes.",
        location: node.startToken?.location ||
          node.leadingTrivia?.[0]?.location!,
      });
    }

    return results;
  },
};
