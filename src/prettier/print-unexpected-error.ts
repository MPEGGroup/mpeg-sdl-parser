import type { AstPath, Doc } from "prettier";
import type { UnexpectedError } from "../ast/node/unexpected-error.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";

export function printUnexpectedError(
  path: AstPath<UnexpectedError>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  return path.call(print, "unexpectedToken");
}
