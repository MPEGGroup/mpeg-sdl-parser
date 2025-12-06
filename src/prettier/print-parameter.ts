import { AstPath, type Doc, doc } from "prettier";
import { addNonBreakingSeparator } from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { Parameter } from "../ast/node/parameter.ts";

export function printParameter(
  path: AstPath<Parameter>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameter = path.node;
  const docs = [];

  if (parameter.classIdentifier !== undefined) {
    docs.push(
      path.call(
        print,
        "classIdentifier" as keyof Parameter["classIdentifier"],
      ),
    );
  } else if (parameter.elementaryType !== undefined) {
    docs.push(
      path.call(
        print,
        "elementaryType" as keyof Parameter["elementaryType"],
      ),
    );
  }

  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "identifier"));

  return docs;
}
