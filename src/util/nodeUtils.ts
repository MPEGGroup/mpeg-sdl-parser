import { NodeType } from "@lezer/common";
import {
  AlignmentBitCount,
  BinaryLiteral,
  DecimalLiteral,
  FloatingPointLiteral,
  HexadecimalLiteral,
  Identifier,
  IntegerLiteral,
} from "../lezer/parser.terms.ts";
import type { Token } from "../ast/token/Token.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";

const primitiveNodeTypes = new Set([
  AlignmentBitCount,
  BinaryLiteral,
  DecimalLiteral,
  FloatingPointLiteral,
  HexadecimalLiteral,
  Identifier,
  IntegerLiteral,
]);

export function isAbstractNode(
  node: AbstractNode | Token,
): node is AbstractNode {
  return node && typeof node === "object" && "nodeKind" in node;
}

export function isPrimitiveNodeType(nodeType: NodeType): boolean {
  return primitiveNodeTypes.has(nodeType.id);
}
