import type { AbstractCompositeNode } from "../node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../node/abstract-leaf-node.ts";

/**
 * Interface representing a handler for nodes in an abstract syntax tree.
 *
 * @interface NodeHandler
 */
export interface NodeHandler {
  beforeVisit(node: AbstractCompositeNode): void;

  visit(node: AbstractLeafNode): void;

  afterVisit(node: AbstractCompositeNode): void;
}
