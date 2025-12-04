import type { AstPath, Doc } from "prettier";
import type { Identifier } from "../ast/node/identifier.ts";
import type { AbstractNode } from "../../index.ts";

export function printIdentifier(
  path: AstPath<Identifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  return path.call(print, "children", 0);
}
