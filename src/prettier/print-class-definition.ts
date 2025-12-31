import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ClassDefinition } from "../ast/node/class-definition.ts";
import { addNonBreakingWhitespace } from "./util/print-utils.ts";

export function printClassDefinition(
  path: AstPath<ClassDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDefinition = path.node;

  const doc: Doc = [];

  if (classDefinition.legacyKeyword) {
    doc.push(
      path.call(
        print,
        "legacyKeyword" as keyof ClassDefinition["legacyKeyword"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  doc.push(path.call(print, "classIdentifier"));
  addNonBreakingWhitespace(doc);

  const identifierDoc = [
    path.call(print, "identifier"),
  ];

  if (classDefinition.parameterValueList !== undefined) {
    identifierDoc.push([
      path.call(
        print,
        "parameterValueList" as keyof ClassDefinition["parameterValueList"],
      ),
    ]);
  }

  doc.push(identifierDoc);
  doc.push(path.call(print, "semicolonPunctuator"));

  return doc;
}
