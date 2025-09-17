import type { AbstractCompositeNode } from "../../src/ast/node/AbstractCompositeNode.ts";
import type { AbstractLeafNode } from "../../src/ast/node/AbstractLeafNode.ts";
import { NodeKind } from "../../src/ast/node/enum/node_kind.ts";
import type { NodeHandler } from "../../src/ast/visitor/NodeHandler.ts";

export default class HistoryRecordingNodeHandler implements NodeHandler {
  nodeHistory: string[] = [];

  beforeVisit(node: AbstractCompositeNode): void {
    this.nodeHistory.push(NodeKind[node.nodeKind]);
  }

  visit(node: AbstractLeafNode): void {
    this.nodeHistory.push(NodeKind[node.nodeKind]);
  }

  afterVisit(_node: AbstractCompositeNode): void {
  }
}

const expectedHistory = [
  "SPECIFICATION",
  "STATEMENT",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "STATEMENT",
  "EXPRESSION",
  "EXPRESSION",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "EXPRESSION",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "STATEMENT",
  "STATEMENT",
  "IDENTIFIER",
  "IDENTIFIER",
  "STATEMENT",
  "EXPRESSION",
  "IDENTIFIER",
  "EXPRESSION",
  "EXPRESSION",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "EXPRESSION",
  "IDENTIFIER",
  "CLASS_MEMBER_ACCESS",
  "IDENTIFIER",
  "STATEMENT",
  "EXPRESSION",
  "EXPRESSION",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "EXPRESSION",
  "IDENTIFIER",
  "NUMBER_LITERAL",
  "STATEMENT",
  "STATEMENT",
  "ELEMENTARY_TYPE",
  "LENGTH_ATTRIBUTE",
  "NUMBER_LITERAL",
  "IDENTIFIER",
  "ARRAY_DIMENSION",
  "IDENTIFIER",
];

export { expectedHistory };
