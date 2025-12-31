import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { StringDefinition } from "../ast/node/string-definition.ts";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

const { fill } = doc.builders;

export function printStringDefinition(
  path: AstPath<StringDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const stringDefinition = path.node;

  const subDoc1: Doc = [];
  if (stringDefinition.reservedKeyword) {
    subDoc1.push(
      path.call(
        print,
        "reservedKeyword" as keyof StringDefinition["reservedKeyword"],
      ),
    );
    addNonBreakingWhitespace(subDoc1);
  }

  if (stringDefinition.legacyKeyword) {
    subDoc1.push(
      path.call(
        print,
        "legacyKeyword" as keyof StringDefinition["legacyKeyword"],
      ),
    );
    addNonBreakingWhitespace(subDoc1);
  }

  if (stringDefinition.constKeyword) {
    subDoc1.push(
      path.call(
        print,
        "constKeyword" as keyof StringDefinition["constKeyword"],
      ),
    );
    addNonBreakingWhitespace(subDoc1);
  }

  if (stringDefinition.alignedModifier !== undefined) {
    subDoc1.push(
      path.call(
        print,
        "alignedModifier" as keyof StringDefinition["alignedModifier"],
      ),
    );
    addNonBreakingWhitespace(subDoc1);
  }

  subDoc1.push(path.call(print, "stringVariableKindToken"));

  let doc: Doc[] = [];

  doc.push(subDoc1);
  doc = addBreakingWhitespace(doc);

  const subDoc2: Doc = [];

  subDoc2.push(path.call(print, "identifier"));

  if (stringDefinition.assignmentPunctuator !== undefined) {
    addNonBreakingWhitespace(subDoc2);
    subDoc2.push(
      path.call(
        print,
        "assignmentPunctuator" as keyof StringDefinition[
          "assignmentPunctuator"
        ],
      ),
    );
    doc.push(subDoc2);

    doc = addBreakingWhitespace(doc);

    const stringLiteralsDoc = path.call(
      print,
      "stringLiteral" as keyof StringDefinition["stringLiteral"],
    );

    if (Array.isArray(stringLiteralsDoc)) {
      stringLiteralsDoc.forEach((stringLiteralDoc, index) => {
        if (index > 0) {
          doc = addBreakingWhitespace(doc);
        }
        if (index === (stringLiteralsDoc.length - 1)) {
          doc.push([
            stringLiteralDoc,
            path.call(print, "semicolonPunctuator"),
          ]);
        } else {
          doc.push(stringLiteralDoc);
        }
      });
    } else {
      doc.push([
        stringLiteralsDoc,
        path.call(print, "semicolonPunctuator"),
      ]);
    }
  } else {
    subDoc2.push(path.call(print, "semicolonPunctuator"));
    doc.push(subDoc2);
  }

  return fill(doc);
}
