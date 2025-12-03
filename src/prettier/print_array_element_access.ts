import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ArrayElementAccess } from "../ast/node/ArrayElementAccess.ts";

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
