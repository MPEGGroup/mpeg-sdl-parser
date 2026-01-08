import type { Text } from "@codemirror/state";
import { TreeCursor } from "@lezer/common";
import { InternalParseError, SyntacticParseError } from "../parse-error.ts";
import { syntacticTokenNodeProp } from "./props/syntactic-token-node-prop-source.ts";
import { getPotentialTokenTypeIds } from "../completion/get-potential-token-type-ids.ts";
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
  const unexpectedNode = cursor.firstChild();

  let message: string = "";

  if (unexpectedNode) {
    message = "Unexpected: " +
      text.sliceString(cursor.from, cursor.to);

    return createParseErrorFromTextAndPosition(
      text,
      cursor.from,
      message,
    );
  }

  // check if the error is for an uknown token
  if (cursor.to > cursor.from) {
    message = "Unknown token: " +
      text.sliceString(cursor.from, cursor.to);

    return createParseErrorFromTextAndPosition(
      text,
      cursor.from,
      message,
    );
  }

  // otherwise it is a missing expected token and we should indicate what token(s) or node(s) could be expected here
  const potentialTokenTypeIds = getPotentialTokenTypeIds(
    cursor,
  );

  if (!potentialTokenTypeIds || potentialTokenTypeIds.length === 0) {
    throw new InternalParseError(
      "Expected token type IDs not found for parse error at position " +
        cursor.from,
    );
  }

  const possibleSyntacticTokens: string[] = [];
  const possibleNodes: string[] = [];
  potentialTokenTypeIds.forEach((id) => {
    const type = nodeSet.types[id];

    if (type.prop(syntacticTokenNodeProp)) {
      possibleSyntacticTokens.push(type.prop(syntacticTokenNodeProp)!);
    } else {
      possibleNodes.push("<" + type.name + ">");
    }
  });

  // sort strings taking into account that some strings may be integers
  possibleSyntacticTokens.sort((a, b) => {
    const aIsNumber = !isNaN(Number(a));
    const bIsNumber = !isNaN(Number(b));

    if (aIsNumber && bIsNumber) {
      return Number(a) - Number(b);
    }
    if (aIsNumber) return -1;
    if (bIsNumber) return 1;
    return a.localeCompare(b);
  });

  possibleNodes.sort();

  const possibleSyntacticTokensAndNodes = [
    ...possibleSyntacticTokens,
    ...possibleNodes,
  ];

  message = possibleSyntacticTokensAndNodes.length > 1
    ? "Expected one of: " + possibleSyntacticTokensAndNodes.join(" ")
    : "Expected: " + possibleSyntacticTokensAndNodes[0];
  return createParseErrorFromTextAndPosition(
    text,
    cursor.from,
    message,
  );
}
