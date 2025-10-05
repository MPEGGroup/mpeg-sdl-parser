import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NumberLiteral } from "../node/NumberLiteral.ts";
import { NumberLiteralKind } from "../node/enum/number_literal_kind.ts";
import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

const ESCAPED_BACKSLASH_REGEX = /\\\\/g;
const ESCAPED_SINGLE_QUOTE_REGEX = /\\'/g;
const MAXIMUM_MULTIPLE_CHARACTER_LITERAL_LENGTH = 10;

function parseUnsignedIntFromMultipleCharacterLiteral(literal: string): number {
  if (literal.length > MAXIMUM_MULTIPLE_CHARACTER_LITERAL_LENGTH) {
    throw new InternalParseError(
      `Multiple character number literal exceeds maximum length of ${MAXIMUM_MULTIPLE_CHARACTER_LITERAL_LENGTH}: ${literal}`,
    );
  }

  let value = 0;
  for (let i = 0; i < literal.length; i++) {
    const charCode = literal.charCodeAt(i);
    if (charCode < 0x20 || charCode > 0x7E) {
      throw new InternalParseError(
        `Invalid character ${
          literal.charCodeAt(i)
        } in multiple character number literal: ${literal}`,
      );
    }

    value = (value << 8) + charCode;
  }

  return value;
}

export function getMultipleCharacterLiteral(
  cursor: TreeCursor,
  text: Text,
): NumberLiteral {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  const literals = [];
  let literalText = "";
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      throw new InternalParseError(
        `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
      );
    } else {
      const tokenText = childNodeOrToken.text;
      if (tokenText !== "'") {
        literalText += tokenText.replaceAll(ESCAPED_SINGLE_QUOTE_REGEX, "'")
          .replaceAll(ESCAPED_BACKSLASH_REGEX, "\\");
      }
      literals.push(childNodeOrToken);
    }
  }

  const value = parseUnsignedIntFromMultipleCharacterLiteral(literalText);

  return new NumberLiteral(
    NumberLiteralKind.MULTIPLE_CHARACTER,
    value,
    literals,
  );
}
