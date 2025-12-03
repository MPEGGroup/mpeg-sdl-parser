import { type Doc, doc } from "prettier";
import type { Trivia } from "../ast/node/Trivia.ts";
import type { Token } from "../ast/node/Token.ts";
import {
  isUnexpectedError,
  type RequiredNode,
  type ZeroToManyList,
} from "../ast/util/types.ts";

const { hardline, ifBreak, line, indent } = doc.builders;

type Fill = doc.builders.Fill;
type Indent = doc.builders.Indent;
type Hardline = doc.builders.Hardline;
type HardlineWithoutBreakParent = doc.builders.HardlineWithoutBreakParent;
type BreakParent = doc.builders.BreakParent;

function isIndent(
  doc: Doc,
): doc is Indent {
  return (doc as Indent).type === "indent";
}

function isFill(
  doc: Doc,
): doc is Fill {
  return (doc as Fill).type === "fill";
}

function isBreakParent(
  doc: Doc,
): doc is BreakParent {
  return (doc as BreakParent).type === "break-parent";
}

function isHardline(
  doc: Doc,
): doc is Hardline {
  return Array.isArray(doc) && (doc.length === 2) &&
    ((doc[0] as HardlineWithoutBreakParent).type === "line") &&
    (doc[0] as HardlineWithoutBreakParent).hard === true;
}

function getCommentString(trivia: Trivia): string {
  if (!trivia.text.startsWith("//")) {
    throw new Error(
      "Logic Error: Expected comment to start with // : " +
        JSON.stringify(trivia),
    );
  }
  // Remove leading "//" from the comment text
  return "// " + trivia.text.replace(/^\s*\/\/\s*/, "").trim();
}

function getLeadingTriviaDoc(token: RequiredNode<Token>): Doc[] {
  const docs: Doc[] = [];

  if (token.leadingTrivia && (token.leadingTrivia.length > 0)) {
    token.leadingTrivia.forEach((trivia, index) => {
      addTrivia(docs, trivia);
      if (token.leadingTrivia && (index < token.leadingTrivia.length - 1)) {
        docs.push(hardline);
      }
    });
  }

  return docs;
}

function getTokenWithTrailingTriviaOnlyDoc(
  token: RequiredNode<Token>,
): Doc[] {
  const docs: Doc[] = [];

  if (isUnexpectedError(token)) {
    docs.push(getTokenWithLeadingAndTrailingTriviaDoc(token.unexpectedToken));
  } else {
    docs.push(token.text);
  }

  if (token.trailingTrivia && (token.trailingTrivia.length > 0)) {
    docs.push(line);
    token.trailingTrivia.forEach((trivia) => {
      addTrivia(docs, trivia);
      docs.push(hardline);
    });
  }

  return docs;
}

function removeTrailingBlankline(doc: Doc): void {
  if (Array.isArray(doc)) {
    if (doc.length === 0) {
      return;
    }

    const lastElement = doc[doc.length - 1];

    if (Array.isArray(lastElement)) {
      // recurse
      removeTrailingBlankline(lastElement);
      return;
    }

    if ((lastElement === "") && (doc.length > 1)) {
      const secondLastElement = doc[doc.length - 2];
      if (isHardline(secondLastElement)) {
        // remove the last two elements
        doc.splice(doc.length - 2, 2);
        return;
      }
    }

    // element might be an indent
    if (isIndent(lastElement)) {
      removeTrailingBlankline(
        lastElement.contents as Doc,
      );
      return;
    }

    // element might be a fill
    if (isFill(lastElement)) {
      removeTrailingBlankline(
        lastElement.parts as Doc,
      );
      return;
    }
  }

  // doc might be an indent
  if (isIndent(doc)) {
    removeTrailingBlankline(doc.contents as Doc);
    return;
  }

  // doc might be a fill
  if (isFill(doc)) {
    removeTrailingBlankline(doc.parts as Doc);
  }
}

export function addTrivia(docs: Doc[], trivia: Trivia): void {
  if (trivia.text === "\n") {
    docs.push("");
  } else {
    docs.push(getCommentString(trivia));
  }
}

export function endsWithHardline(doc: Doc): boolean {
  if (Array.isArray(doc) && (doc.length > 0)) {
    // find last element which is not a break-parent
    let i = doc.length - 1;
    while ((i >= 0) && isBreakParent(doc[i])) {
      i--;
    }

    if (i >= 0) {
      const lastNonBreakParentElement = doc[i];

      if (Array.isArray(lastNonBreakParentElement)) {
        return endsWithHardline(lastNonBreakParentElement);
      }

      // element might be an indent
      if (isIndent(lastNonBreakParentElement)) {
        return endsWithHardline(
          lastNonBreakParentElement.contents as Doc,
        );
      }

      // element might be a fill
      if (isFill(lastNonBreakParentElement)) {
        return endsWithHardline(
          lastNonBreakParentElement.parts as Doc,
        );
      }
    }

    // else treat doc as a potential hardline itself
    return isHardline(doc);
  }

  // doc might be an indent
  if (isIndent(doc)) {
    return endsWithHardline(doc.contents as Doc);
  }

  // doc might be a fill
  if (isFill(doc)) {
    return endsWithHardline(doc.parts as Doc);
  }

  return false;
}

export function removeLeadingBlankline(doc: Doc): void {
  if (Array.isArray(doc)) {
    if (doc.length === 0) {
      return;
    }

    const firstElement = doc[0];

    if (Array.isArray(firstElement)) {
      // recurse
      removeLeadingBlankline(firstElement);
      return;
    }

    if ((firstElement === "") && (doc.length > 1)) {
      const secondElement = doc[1];
      if (isHardline(secondElement)) {
        // remove the first two elements
        doc.splice(0, 2);
        return;
      }
    }

    // element might be an indent
    if (isIndent(firstElement)) {
      removeLeadingBlankline(
        firstElement.contents as Doc,
      );
      return;
    }

    // element might be a fill
    if (isFill(firstElement)) {
      removeLeadingBlankline(
        firstElement.parts as Doc,
      );
      return;
    }
  }

  // doc might be an indent
  if (isIndent(doc)) {
    removeLeadingBlankline(doc.contents as Doc);
    return;
  }

  // doc might be a fill
  if (isFill(doc)) {
    removeLeadingBlankline(doc.parts as Doc);
  }
}

export function removeTrailingHardline(doc: Doc): void {
  if (Array.isArray(doc) && (doc.length > 0)) {
    // find last element which is not a break-parent
    let i = doc.length - 1;
    while ((i >= 0) && isBreakParent(doc[i])) {
      i--;
    }

    if (i >= 0) {
      const lastNonBreakParentElement = doc[i];

      if (Array.isArray(lastNonBreakParentElement)) {
        if (isHardline(lastNonBreakParentElement)) {
          // remove the hardline
          doc.splice(i, 1);
          return;
        }

        // recurse
        removeTrailingHardline(lastNonBreakParentElement);
      }

      // element might be an indent
      if (isIndent(lastNonBreakParentElement)) {
        removeTrailingHardline(
          lastNonBreakParentElement.contents as Doc,
        );
        return;
      }

      // element might be a fill
      if (isFill(lastNonBreakParentElement)) {
        removeTrailingHardline(
          lastNonBreakParentElement.parts as Doc,
        );
        return;
      }
    }
  }

  // doc might be an indent
  if (isIndent(doc)) {
    removeTrailingHardline(doc.contents as Doc);
    return;
  }

  // doc might be a fill
  if (isFill(doc)) {
    removeTrailingHardline(doc.parts as Doc);
  }
}

export function addIfNoTrailingHardline(
  doc: Doc[],
  docToAdd: Doc,
): void {
  if (!endsWithHardline(doc)) {
    doc.push(docToAdd);
  }
}

export function addIndentedBlock(
  docs: Doc[],
  statementDocs: Doc[],
  openBracePunctuator: RequiredNode<Token>,
  closeBracePunctuator: RequiredNode<Token>,
) {
  const indentedDocs: Doc[] = [];

  const braceDocs = getTokenWithLeadingAndTrailingTriviaDoc(
    openBracePunctuator,
  );

  removeLeadingBlankline(braceDocs);

  indentedDocs.push(braceDocs);

  for (let i = 0; i < statementDocs.length; i++) {
    addIfNoTrailingHardline(indentedDocs, hardline);

    const statementDoc = statementDocs[i];

    if (i === 0) {
      // remove blank lines after opening brace
      removeLeadingBlankline(statementDoc);
    }

    if (i === statementDocs.length - 1) {
      removeTrailingHardline(statementDoc);
    }
    indentedDocs.push(statementDoc);
  }

  if (
    closeBracePunctuator.leadingTrivia &&
    (closeBracePunctuator.leadingTrivia.length > 0)
  ) {
    indentedDocs.push(hardline);
    const leadingTrivia = getLeadingTriviaDoc(closeBracePunctuator);

    // remove blank lines before closing brace
    removeTrailingBlankline(leadingTrivia);

    indentedDocs.push(leadingTrivia);
  }

  docs.push(indent(indentedDocs));
  docs.push(hardline);
  docs.push(getTokenWithTrailingTriviaOnlyDoc(closeBracePunctuator));
}

export function addIndentedStatements(docs: Doc[], statementDocs: Doc[]) {
  const indentedDocs: Doc[] = [];

  for (let i = 0; i < statementDocs.length; i++) {
    addIfNoTrailingHardline(indentedDocs, hardline);

    const statementDoc = statementDocs[i];

    if (i === statementDocs.length - 1) {
      removeTrailingHardline(statementDoc);
    }
    indentedDocs.push(statementDoc);
  }

  docs.push(indent(indentedDocs));
  docs.push(hardline);
}

export function addBreakingSeparator(docs: Doc[]): void {
  if (!endsWithHardline(docs)) {
    docs.push(ifBreak([line, "  "], " "));
  } else {
    docs.push("  ");
  }
}

export function addNonBreakingSeparator(docs: Doc[]): void {
  if (!endsWithHardline(docs)) {
    docs.push(" ");
  } else {
    docs.push("  ");
  }
}

export function addCommaSeparatorsToDoc(
  valuesDoc: Doc[],
  commaSeparatorTokens: ZeroToManyList<Token>,
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

  const docs: Doc[] = [];
  for (let i = 0; i < valuesDoc.length; i++) {
    if (i < commaSeparatorTokens.length) {
      const valueDocs: Doc[] = [];

      valueDocs.push(valuesDoc[i]);
      valueDocs.push(
        getTokenWithLeadingAndTrailingTriviaDoc(commaSeparatorTokens[i]),
      );

      addBreakingSeparator(valueDocs);

      docs.push(valueDocs);
    } else {
      docs.push(valuesDoc[i]);
    }
  }

  return docs;
}
