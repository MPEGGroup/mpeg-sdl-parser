import { type Doc, doc } from "prettier";
import type { Trivia } from "../../ast/node/trivia.ts";
import type { AbstractNode } from "../../ast/node/abstract-node.ts";
import {
  isBreakParent,
  isFill,
  isHardline,
  isIndent,
  isLabel,
} from "./types.ts";
import { InternalParseError } from "../../parse-error.ts";

const { hardline, ifBreak, label, line, indent } = doc.builders;

function getCommentString(trivia: Trivia): string {
  if (!trivia.text.startsWith("//")) {
    throw new InternalParseError(
      "Logic Error: Expected comment to start with // : " +
        JSON.stringify(trivia),
    );
  }
  // Remove leading "//" from the comment text
  return "// " + trivia.text.replace(/^\s*\/\/\s*/, "").trim();
}

function addTrivia(doc: Doc, trivia: Trivia): Doc[] {
  let commentDoc: Doc = [];

  if (trivia.text === "\n") {
    commentDoc = "";
  } else {
    commentDoc = getCommentString(trivia);
  }
  if (Array.isArray(doc)) {
    doc.push(commentDoc);
  } else {
    doc = [doc, commentDoc];
  }

  return doc;
}

/**
 * Gets the leading trivia doc for the given node if it has any leading trivia.
 */
export function getLeadingTriviaDoc(node: AbstractNode): Doc | undefined {
  if (!node || !node.leadingTrivia || (node.leadingTrivia.length === 0)) {
    return undefined;
  }

  let doc: Doc = [];

  node.leadingTrivia.forEach((trivia) => {
    doc = addTrivia(doc, trivia);
    doc.push(hardline);
  });

  return label("leadingTrivia", doc);
}

/**
 * Gets the trailing trivia doc for the given node if it has any trailing trivia.
 */
export function getTrailingTriviaDoc(node: AbstractNode): Doc | undefined {
  if (!node || !node.trailingTrivia || (node.trailingTrivia.length === 0)) {
    return undefined;
  }

  let doc: Doc = [];

  node.trailingTrivia.forEach((trivia) => {
    doc = addTrivia(doc, trivia);
    doc.push(hardline);
  });

  return label("trailingTrivia", doc);
}

/**
 * Adds the trailing trivia doc to the given doc.
 */
export function addTrailingTriviaDoc(
  doc: Doc,
  trailingTriviaDoc: Doc,
): Doc {
  if (Array.isArray(doc)) {
    if (doc.length === 0) {
      doc = [
        trailingTriviaDoc,
      ];

      return doc;
    }

    // find last element which is not a break-parent and not a hardline
    let i = doc.length - 1;
    while ((i >= 0) && (isBreakParent(doc[i]) || isHardline(doc[i]))) {
      i--;
    }

    if (i < 0) {
      return doc;
    }
    const lastNonBreakParentElement = doc[i];

    if (Array.isArray(lastNonBreakParentElement)) {
      doc[i] = addTrailingTriviaDoc(
        lastNonBreakParentElement,
        trailingTriviaDoc,
      );

      return doc;
    }

    // element might be an indent or label
    if (
      isIndent(lastNonBreakParentElement) ||
      isLabel(lastNonBreakParentElement)
    ) {
      lastNonBreakParentElement.contents = addTrailingTriviaDoc(
        lastNonBreakParentElement.contents,
        trailingTriviaDoc,
      );
    } // element might be a fill
    else if (isFill(lastNonBreakParentElement)) {
      lastNonBreakParentElement.parts = addTrailingTriviaDoc(
        lastNonBreakParentElement.parts,
        trailingTriviaDoc,
      ) as Doc[];
    } // otherwise we found the last element to add trivia after
    // behavior is different if the token is a close brace
    else if (lastNonBreakParentElement === "}") {
      doc[i] = [
        lastNonBreakParentElement,
        ifBreak([line, ""], " "),
        trailingTriviaDoc,
      ];
    } else {
      doc[i] = [
        lastNonBreakParentElement,
        ifBreak([line, "  "], " "),
        trailingTriviaDoc,
      ];
    }

    return doc;
  }

  if (isIndent(doc) || isLabel(doc)) {
    doc.contents = addTrailingTriviaDoc(doc.contents, trailingTriviaDoc);
  } else if (isFill(doc)) {
    doc.parts = addTrailingTriviaDoc(doc.parts, trailingTriviaDoc) as Doc[];
  }

  return doc;
}

/**
 * Determines whether the given doc ends with a hardline, ignoring trailing break-parents.
 */
export function endsWithHardline(doc: Doc): boolean {
  if (Array.isArray(doc)) {
    // can't end with hardline if empty array
    if (doc.length === 0) {
      return false;
    }

    // potential hardline as hardline is an array of [HardlineWithoutBreakParent, BreakParent]
    if (isHardline(doc)) {
      return true;
    }

    // find last element which is not a break-parent as we ignore trailing break-parents
    let i = doc.length - 1;
    while ((i >= 0) && isBreakParent(doc[i])) {
      i--;
    }

    if (i < 0) {
      return false;
    }

    // recurse
    return endsWithHardline(doc[i]);
  }

  // recurse
  if (isIndent(doc) || isLabel(doc)) {
    return endsWithHardline(doc.contents);
  }

  // recurse
  if (isFill(doc)) {
    return endsWithHardline(doc.parts);
  }

  return false;
}

/**
 * Determines whether the given doc starts with a blank line i.e. ["", hardline, ...]
 */
export function startsWithBlankLine(doc: Doc): boolean {
  if (Array.isArray(doc)) {
    // can't contain leading blankline if empty array
    if (doc.length === 0) {
      return false;
    }

    // check if the array starts with ["", hardline, ...]
    if (doc.length >= 2) {
      if ((doc[0] === "") && isHardline(doc[1])) {
        return true;
      }
    }

    // recurse
    return startsWithBlankLine(doc[0]);
  }

  // recurse
  if (isIndent(doc) || isLabel(doc)) {
    return startsWithBlankLine(doc.contents);
  }
  if (isFill(doc)) {
    return startsWithBlankLine(doc.parts);
  }

  return false;
}

function removeLeadingBlankline(doc: Doc): Doc {
  if (Array.isArray(doc)) {
    // can't contain leading blankline if empty array
    if (doc.length === 0) {
      return doc;
    }

    // check if the array starts with ["", hardline, ...]
    if (doc.length >= 2) {
      if ((doc[0] === "") && isHardline(doc[1])) {
        // remove the first two elements
        doc.splice(0, 2);

        // don't return a single item array
        if (doc.length === 1) {
          return doc[0];
        }

        return doc;
      }
    }

    // recurse
    const firstItem = removeLeadingBlankline(doc[0]);

    // don't leave an empty array at the start
    if (Array.isArray(firstItem) && (firstItem.length === 0)) {
      doc.splice(0, 1);
    } else {
      doc[0] = firstItem;
    }

    // don't return a single item array
    if (doc.length === 1) {
      return doc[0];
    }

    return doc;
  }

  // recurse
  if (isIndent(doc) || isLabel(doc)) {
    doc.contents = removeLeadingBlankline(doc.contents);

    if (
      (doc.contents === "") ||
      (Array.isArray(doc.contents) && (doc.contents.length === 0))
    ) {
      doc = "";
    }
  } else if (isFill(doc)) {
    doc.parts = removeLeadingBlankline(doc.parts) as Doc[];

    if (doc.parts.length === 0) {
      doc = "";
    }
  }

  return doc;
}

/**
 * Removes leading blanklines i.e. ["", hardline, ...] from the given doc if they exist.
 */
export function removeLeadingBlanklines(doc: Doc): Doc {
  while (startsWithBlankLine(doc)) {
    doc = removeLeadingBlankline(doc);
  }
  return doc;
}

/**
 * Removes a trailing blankline i.e. [..., "", hardline] from the given doc if it exists.
 */
export function removeTrailingBlankline(doc: Doc): Doc {
  if (Array.isArray(doc)) {
    // can't contain trailing blankline if empty array
    if (doc.length === 0) {
      return doc;
    }

    // check if the array ends with [..., "", hardline]
    if (doc.length >= 2) {
      if ((doc[doc.length - 2] === "") && isHardline(doc[doc.length - 1])) {
        // remove the last two elements
        doc.splice(doc.length - 2, 2);

        // don't return a single item array
        if (doc.length === 1) {
          return doc[0];
        }

        return doc;
      }
    }

    // recurse
    let lastItem = doc[doc.length - 1];

    lastItem = removeTrailingBlankline(lastItem);

    // don't leave an empty array at the end
    if (Array.isArray(lastItem) && (lastItem.length === 0)) {
      doc.splice(doc.length - 1, 1);
    } else {
      doc[doc.length - 1] = lastItem;
    }

    // don't return a single item array
    if (doc.length === 1) {
      return doc[0];
    }

    return doc;
  }

  // recurse
  if (isIndent(doc) || isLabel(doc)) {
    doc.contents = removeTrailingBlankline(doc.contents);

    if (
      (doc.contents === "") ||
      (Array.isArray(doc.contents) && (doc.contents.length === 0))
    ) {
      doc = "";
    }
  } else if (isFill(doc)) {
    doc.parts = removeTrailingBlankline(doc.parts) as Doc[];

    if (doc.parts.length === 0) {
      doc = "";
    }
  }

  return doc;
}

/**
 * Removes a trailing hardline from the given doc if it exists.
 */
export function removeTrailingHardline(doc: Doc): Doc {
  if (Array.isArray(doc)) {
    if (doc.length === 0) {
      return doc;
    }

    // array might be a hardline itself
    if (isHardline(doc)) {
      return "";
    }

    let lastElement = doc[doc.length - 1];

    // recurse
    lastElement = removeTrailingHardline(lastElement);

    // don't store empty element
    if (lastElement !== "") {
      doc[doc.length - 1] = lastElement;
    } else {
      doc.splice(doc.length - 1, 1);
    }

    // don't return a single item array
    if (doc.length === 1) {
      doc = doc[0];
    }

    // don't return an empty array
    if ((doc as Doc[]).length === 0) {
      doc = "";
    }

    return doc;
  }

  // recurse
  if (isIndent(doc) || isLabel(doc)) {
    doc.contents = removeTrailingHardline(doc.contents);

    if (
      (doc.contents === "") ||
      (Array.isArray(doc.contents) && (doc.contents.length === 0))
    ) {
      doc = "";
    }
  } else if (isFill(doc)) {
    let parts = removeTrailingHardline(doc.parts);

    if (!Array.isArray(parts)) {
      if (parts === "") {
        return "";
      }
      parts = [parts];
    }

    doc.parts = parts;

    if (doc.parts.length === 0) {
      doc = "";
    }
  }

  return doc;
}

/**
 * Adds a trailing hardline to the given doc if it does not already end with a hardline.
 */
export function addTrailingHardline(doc: Doc): Doc {
  if (!endsWithHardline(doc)) {
    if (Array.isArray(doc)) {
      doc.push(hardline);
      return doc;
    }

    return [doc, hardline];
  }

  return doc;
}

/**
 * Adds indented statement docs to the given doc,
 * optionally with opening and closing brace punctuator docs.
 */
export function addIndentedStatements(
  doc: Doc[],
  statementDocs: Doc[],
  openBracePunctuatorDoc?: Doc,
  closeBracePunctuatorDoc?: Doc,
): Doc[] {
  let indentedDoc: Doc = [];

  if (openBracePunctuatorDoc) {
    // remove blankline before opening brace
    openBracePunctuatorDoc = removeLeadingBlanklines(openBracePunctuatorDoc);

    indentedDoc.push(openBracePunctuatorDoc);
  }

  // indented block should have a hardline before statements
  if (statementDocs.length > 0) {
    indentedDoc = addTrailingHardline(indentedDoc);
    if (!Array.isArray(indentedDoc)) {
      indentedDoc = [indentedDoc];
    }
  }

  for (let i = 0; i < statementDocs.length; i++) {
    let statementDoc = statementDocs[i];

    // remove blank lines above first statement
    if (i === 0) {
      statementDoc = removeLeadingBlanklines(statementDoc);
    }

    indentedDoc.push(statementDoc);
    if ((i < statementDocs.length - 1) && !endsWithHardline(indentedDoc)) {
      indentedDoc.push(hardline);
    }
  }

  if (Array.isArray(closeBracePunctuatorDoc)) {
    // look for leading trivia element and remove it from closeBracePunctuatorDoc array
    let firstElement = closeBracePunctuatorDoc[0];

    if (isLabel(firstElement) && (firstElement.label === "leadingTrivia")) {
      // remove leading trivia from closeBracePunctuatorDoc to inside indented block
      closeBracePunctuatorDoc.splice(0, 1);

      if (closeBracePunctuatorDoc.length === 1) {
        closeBracePunctuatorDoc = closeBracePunctuatorDoc[0];
      }

      // remove blank line before closing brace i.e. any blank line of trivia above the brace
      firstElement = removeTrailingBlankline(firstElement);
      firstElement = removeTrailingHardline(firstElement);

      // check if anything remains
      if (firstElement !== "") {
        if (!endsWithHardline(indentedDoc)) {
          indentedDoc.push(hardline);
        }
        indentedDoc.push(firstElement);
      }
    }
  }

  if (indentedDoc.length > 0) {
    // remove blank line before closing brace
    indentedDoc = removeTrailingBlankline(indentedDoc);
    indentedDoc = removeTrailingHardline(indentedDoc);
    doc.push(indent(indentedDoc));
    doc.push(hardline);
  }

  if (closeBracePunctuatorDoc) {
    doc.push(closeBracePunctuatorDoc);
  }

  return doc;
}

function addWhitespace(doc: Doc, isBreaking: boolean): Doc[] {
  let separatorDoc: Doc;

  if (!endsWithHardline(doc)) {
    separatorDoc = isBreaking ? ifBreak([line, "  "], " ") : " ";
  } else {
    separatorDoc = "  ";
  }

  if (Array.isArray(doc)) {
    doc.push(separatorDoc);
  } else {
    doc = [doc, separatorDoc];
  }

  return doc;
}

/**
 * Adds a breaking whitespace to the given doc or an indent if it ends with a hardline.
 */
export function addBreakingWhitespace(doc: Doc): Doc[] {
  return addWhitespace(doc, true);
}

/**
 * Adds a non-breaking whitespace to the given doc or an indent if it ends with a hardline.
 */
export function addNonBreakingWhitespace(doc: Doc): Doc[] {
  return addWhitespace(doc, false);
}

/**
 * Interleaves the given value docs with the given comma separator docs and adds breaking whitespace after each comma separator.
 */
export function interleaveCommaSeparatorDocs(
  valueDocs: Doc[],
  commaSeparatorDocs: Doc[],
): Doc {
  if (commaSeparatorDocs.length === 0) {
    if (valueDocs.length > 1) {
      throw new InternalParseError(
        `Logic Error: Number of values: ${valueDocs.length} and no comma separators provided`,
      );
    }
    return valueDocs;
  }

  if (valueDocs.length !== commaSeparatorDocs.length + 1) {
    throw new InternalParseError(
      `Logic Error: Number of values: ${valueDocs.length} and comma separators: ${commaSeparatorDocs.length} are not as expected`,
    );
  }

  const doc: Doc = [];
  for (let i = 0; i < valueDocs.length; i++) {
    if (i < commaSeparatorDocs.length) {
      let subDoc: Doc = [];

      subDoc.push(valueDocs[i]);
      subDoc.push(commaSeparatorDocs[i]);

      subDoc = addBreakingWhitespace(subDoc);

      doc.push(subDoc);
    } else {
      doc.push(valueDocs[i]);
    }
  }

  return doc;
}
