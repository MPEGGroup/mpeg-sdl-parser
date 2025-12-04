import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { StringDefinition } from "../ast/node/string-definition.ts";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print-utils.ts";

const { fill } = doc.builders;

export function printStringDefinition(
  path: AstPath<StringDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const stringDefinition = path.node;

  const subDocs1: Doc[] = [];
  if (stringDefinition.reservedKeyword) {
    subDocs1.push(
      path.call(
        print,
        "reservedKeyword" as keyof StringDefinition["reservedKeyword"],
      ),
    );
    addNonBreakingSeparator(subDocs1);
  }

  if (stringDefinition.legacyKeyword) {
    subDocs1.push(
      path.call(
        print,
        "legacyKeyword" as keyof StringDefinition["legacyKeyword"],
      ),
    );
    addNonBreakingSeparator(subDocs1);
  }

  if (stringDefinition.constKeyword) {
    subDocs1.push(
      path.call(
        print,
        "constKeyword" as keyof StringDefinition["constKeyword"],
      ),
    );
    addNonBreakingSeparator(subDocs1);
  }

  if (stringDefinition.alignedModifier !== undefined) {
    subDocs1.push(
      path.call(
        print,
        "alignedModifier" as keyof StringDefinition["alignedModifier"],
      ),
    );
    addNonBreakingSeparator(subDocs1);
  }

  subDocs1.push(path.call(print, "stringVariableKindToken"));

  const docs: Doc[] = [];

  docs.push(subDocs1);
  addBreakingSeparator(docs);

  const subDocs2: Doc[] = [];

  subDocs2.push(path.call(print, "identifier"));

  if (stringDefinition.assignmentPunctuator !== undefined) {
    addNonBreakingSeparator(subDocs2);
    subDocs2.push(
      path.call(
        print,
        "assignmentPunctuator" as keyof StringDefinition[
          "assignmentPunctuator"
        ],
      ),
    );
    docs.push(subDocs2);

    addBreakingSeparator(docs);

    const stringLiteralDocs = path.call(
      print,
      "stringLiteral" as keyof StringDefinition["stringLiteral"],
    ) as Doc[];
    stringLiteralDocs.forEach((stringLiteralDoc, index) => {
      if (index > 0) {
        addBreakingSeparator(docs);
      }
      if (index === stringLiteralDocs.length - 1) {
        docs.push([
          stringLiteralDoc,
          path.call(print, "semicolonPunctuator"),
        ]);
      } else {
        docs.push(stringLiteralDoc);
      }
    });
  } else {
    subDocs2.push(path.call(print, "semicolonPunctuator"));
    docs.push(subDocs2);
  }

  return fill(docs);
}
