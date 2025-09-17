import type { Doc } from "prettier";
import { doc } from "prettier";
import type { Token } from "../ast/token/Token.ts";
import type { Trivia } from "../ast/token/Trivia.ts";
const { hardline, indent, join } = doc.builders;

function getCommentString(trivia: Trivia): string {
  if (!trivia.text.startsWith("//")) {
    throw new Error(
      "Logic Error: Expected comment to start with // : " +
        JSON.stringify(trivia),
    );
  }
  // Remove leading "//" from the comment text
  const commentText = trivia.text.replace(/^\s*\/\/\s*/, "").trim();
  return "// " + commentText;
}

/**
 * Returns a doc for the leading trivia of a token.
 * @param token The token to get the leading trivia for.
 * @param indentLeadingTriviaAsIndentIsCompleting Whether to indent the leading trivia as if it is completing a line.
 *
 * Note that if indentLeadingTriviaAsIndentIsCompleting is true, the leading trivia will include a hardline as this
 * is required to perform the indent.
 */
function getLeadingTriviaDoc(
  token: Token,
  indentLeadingTriviaAsIndentIsCompleting: boolean,
): Doc[] {
  if (!token.leadingTrivia.length) {
    if (indentLeadingTriviaAsIndentIsCompleting) {
      return [hardline];
    }
    return [];
  }

  const elements = join(
    hardline,
    token.leadingTrivia.map((trivia) => getCommentString(trivia)),
  );

  if (indentLeadingTriviaAsIndentIsCompleting) {
    return [
      indent(
        [hardline, elements],
      ),
      hardline,
    ];
  }

  return [
    elements,
    hardline,
  ];
}

function getTrailingTriviaDoc(token: Token): Doc[] {
  if (!token.trailingTrivia.length) {
    return [];
  }

  return [
    " ",
    join(
      hardline,
      token.trailingTrivia.map((trivia) => getCommentString(trivia)),
    ),
    hardline,
  ];
}

export function getDocWithTrivia(
  token: Token,
  indentLeadingTriviaAsIndentIsCompleting = false,
): Doc[] {
  const leadingTriviaDoc = getLeadingTriviaDoc(
    token,
    indentLeadingTriviaAsIndentIsCompleting,
  );
  const trailingTriviaDoc = getTrailingTriviaDoc(token);

  const doc = [];
  if (leadingTriviaDoc.length > 0) {
    doc.push(leadingTriviaDoc);
  }
  doc.push(token.text);
  if (trailingTriviaDoc.length > 0) {
    doc.push(trailingTriviaDoc);
  }

  return doc;
}

export function addCommaSeparatorsToDoc(
  valuesDoc: Doc[],
  commaSeparatorTokens: Token[] | undefined,
): Doc[] {
  if (commaSeparatorTokens === undefined) {
    if (valuesDoc.length > 1) {
      throw new Error(
        `Logic Error: Number of values: ${valuesDoc.length} and no comma separators provided`,
      );
    }
    return valuesDoc;
  }

  if (valuesDoc.length !== commaSeparatorTokens.length + 1) {
    throw new Error(
      `Logic Error: Number of values: ${valuesDoc.length} and comma separators: ${commaSeparatorTokens.length} are not as expected`,
    );
  }

  const result: Doc[] = [];
  for (let i = 0; i < valuesDoc.length; i++) {
    if (i < commaSeparatorTokens.length) {
      result.push([
        valuesDoc[i],
        getDocWithTrivia(commaSeparatorTokens[i]),
      ]);
    } else {
      result.push(valuesDoc[i]);
    }
  }

  return result;
}
