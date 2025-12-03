import type { AstPath, Doc } from "prettier";
import type { Token } from "../ast/node/Token.ts";

export function printToken(path: AstPath<Token>): Doc {
  const node = path.node;
  return node.text;
}
