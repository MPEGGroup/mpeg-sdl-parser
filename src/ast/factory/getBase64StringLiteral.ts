import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import { StringLiteral } from "../node/StringLiteral.ts";
import { StringLiteralKind } from "../node/enum/string_literal_kind.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

const ESCAPED_BACKSLASH_REGEX = /\\\\/g;
const ESCAPED_DOUBLE_QUOTE_REGEX = /\\"/g;

export function getBase64StringLiteral(
  cursor: TreeCursor,
  text: Text,
): StringLiteral {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  const literals: Token[] = [];
  let value = "";

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      throw new InternalParseError(
        `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
      );
    } else {
      const tokenText = childNodeOrToken.text;

      if (tokenText !== '"') {
        value += tokenText;
      }
      literals.push(childNodeOrToken);
    }
  }
  value = value.replaceAll(ESCAPED_DOUBLE_QUOTE_REGEX, "'")
    .replaceAll(ESCAPED_BACKSLASH_REGEX, "\\");

  return new StringLiteral(
    StringLiteralKind.BASIC,
    value,
    literals,
  );
}
