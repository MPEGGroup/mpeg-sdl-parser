import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { LengthAttribute } from "../ast/node/LengthAttribute.ts";

export function printLengthAttribute(
  path: AstPath<LengthAttribute>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  return [
    path.call(print, "openParenthesisPunctuator"),
    path.call(print, "length"),
    path.call(print, "closeParenthesisPunctuator"),
  ];
}
