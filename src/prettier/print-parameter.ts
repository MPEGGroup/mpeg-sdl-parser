import { AstPath, type Doc, doc } from "prettier";
import { addNonBreakingWhitespace } from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { Parameter } from "../ast/node/parameter.ts";

export function printParameter(
  path: AstPath<Parameter>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameter = path.node;
  const doc: Doc = [];

  if (parameter.classIdentifier !== undefined) {
    doc.push(
      path.call(
        print,
        "classIdentifier" as keyof Parameter["classIdentifier"],
      ),
    );
  } else if (parameter.elementaryType !== undefined) {
    doc.push(
      path.call(
        print,
        "elementaryType" as keyof Parameter["elementaryType"],
      ),
    );
  }

  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "identifier"));

  return doc;
}
