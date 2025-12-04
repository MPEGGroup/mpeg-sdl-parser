import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ElementaryTypeOutputValue } from "../ast/node/elementary-type-output-value.ts";

export function printElementaryTypeOutputValue(
  path: AstPath<ElementaryTypeOutputValue>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  return [
    path.call(print, "elementaryType"),
    path.call(print, "lengthAttribute"),
  ];
}
