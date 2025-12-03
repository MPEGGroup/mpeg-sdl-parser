import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ClassMemberAccess } from "../ast/node/ClassMemberAccess.ts";

export function printClassMemberAccess(
  path: AstPath<ClassMemberAccess>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  return [
    path.call(print, "classMemberAccessOperator"),
    path.call(print, "memberIdentifier"),
  ];
}
