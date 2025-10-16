import type { Token } from "../ast/token/Token.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";

export function isAbstractNode(
  node: AbstractNode | Token,
): node is AbstractNode {
  return node && (typeof node === "object") && ("nodeKind" in node);
}
