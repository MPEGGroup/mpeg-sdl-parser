import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ClassDefinition } from "../ast/node/ClassDefinition.ts";
import { addNonBreakingSeparator } from "./print_utils.ts";

export function printClassDefinition(
  path: AstPath<ClassDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDefinition = path.node;

  const docs = [];

  if (classDefinition.legacyKeyword) {
    docs.push(
      path.call(
        print,
        "legacyKeyword" as keyof ClassDefinition["legacyKeyword"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  docs.push(path.call(print, "classIdentifier"));
  addNonBreakingSeparator(docs);

  const identifierDocs = [
    path.call(print, "identifier"),
  ];

  if (classDefinition.parameterValueList !== undefined) {
    identifierDocs.push([
      path.call(
        print,
        "parameterValueList" as keyof ClassDefinition["parameterValueList"],
      ),
    ]);
  }

  docs.push(identifierDocs);
  docs.push(path.call(print, "semicolonPunctuator"));

  return docs;
}
