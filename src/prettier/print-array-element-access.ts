import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ArrayElementAccess } from "../ast/node/array-element-access.ts";

export function printArrayElementAccess(
  path: AstPath<ArrayElementAccess>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  return [
    path.call(print, "openBracketPunctuator"),
    path.call(print, "index"),
    path.call(print, "closeBracketPunctuator"),
  ];
}
