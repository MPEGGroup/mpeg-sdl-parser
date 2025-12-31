import type { Text } from "@codemirror/state";
import { TreeCursor } from "@lezer/common";
import { InternalParseError, SyntacticParseError } from "../parse-error.ts";
import { primitiveNodeProp } from "./props/primitive-node-prop-source.ts";
import { syntacticTokenNodeProp } from "./props/syntactic-token-node-prop-source.ts";
import { getExpectedTokenTypeIds } from "../completion/get-expected-token-type-ids.ts";
import { createParseErrorFromTextAndPosition } from "./create-parse-error-from-text-and-position.ts";
import { createLenientSdlParser } from "./create-sdl-parser.ts";

const lenientSdlParser = createLenientSdlParser();

const nodeSet = lenientSdlParser.nodeSet;

/**
 * Helper function to create a SyntacticParseError from the text and a cursor positioned at an error node.
 * As the cursor from a parse tree is available, details on missing or unexpected tokens can be extracted.
 *
 * @param text The text to parse.
 * @param cursor The cursor position in the text which should be at an error node.
 */
export function createParseErrorFromTextAndCursor(
  text: Text,
  cursor: TreeCursor,
): SyntacticParseError {
  if (!cursor.type.isError) {
    throw new InternalParseError(
      "Expected cursor to be an error token, but it is not",
    );
  }

  // if the error token has a child, the child is an unexpected token
  const unexpectedToken = cursor.firstChild();

  let message: string = "";

  if (unexpectedToken) {
    message = "Unexpected token: " +
      text.sliceString(cursor.from, cursor.to);

    if (cursor.type.prop(primitiveNodeProp)) {
      message += " <" + cursor.name + ">";
    }
    return createParseErrorFromTextAndPosition(
      text,
      cursor.from,
      message,
    );
  }
  // otherwise it is a missing expected token and we should indicate what token(s) or node(s) could be expected here
  const expectedTokenTypeIds = getExpectedTokenTypeIds(
    cursor,
  );

  if (!expectedTokenTypeIds || expectedTokenTypeIds.length === 0) {
    throw new InternalParseError(
      "Expected token type IDs not found for parse error at position " +
        cursor.from,
    );
  }

  let includesToken = false;
  let includesNode = false;

  message += ":";
  expectedTokenTypeIds.forEach((id, index) => {
    if (index > 0) {
      message += " or";
    }
    let value: string;

    const type = nodeSet.types[id];

    if (type.prop(syntacticTokenNodeProp)) {
      includesToken = true;
      value = type.prop(syntacticTokenNodeProp)!;
    } else {
      includesNode = true;
      value = "<" + type.name + ">";
    }
    message += " " + value;
  });

  if (includesToken) {
    if (includesNode) {
      message = "Missing expected token or node" + message;
    } else {
      message = "Missing expected token" + message;
    }
  } else if (includesNode) {
    message = "Missing expected node" + message;
  }

  return createParseErrorFromTextAndPosition(
    text,
    cursor.from,
    message,
  );
}
