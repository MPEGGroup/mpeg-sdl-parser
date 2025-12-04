import getLogger from "../../util/logger.ts";
import type { AbstractCompositeNode } from "../node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../node/abstract-leaf-node.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import type { NodeHandler } from "./node-handler.ts";
import type { NodeVisitor } from "./node-visitor.ts";
import { debugEnabled } from "../../util/logger.ts";
import { isToken } from "../util/types.ts";

const logger = getLogger("TraversingVisitor");

/**
 * A visitor that traverses nodes and delegates operations to a node handler.
 */
export class TraversingVisitor implements NodeVisitor {
  constructor(public readonly nodeHandler: NodeHandler) {}

  depth = 0;

  /**
   * Called when visiting a node.
   * @param node The node to visit.
   */
  visit(node: AbstractNode): void {
    const indent = "  ".repeat(this.depth);

    if (debugEnabled) {
      let tokenText = "";
      if (isToken(node)) {
        tokenText = ` => ${node.text}`;
      }

      if (node.leadingTrivia) {
        tokenText += ` => leadingTrivia: ${
          node.leadingTrivia.map((t) => `"${t.text.replace(/\n/g, "\\n")}"`)
            .join(", ")
        }`;
      }

      if (node.trailingTrivia) {
        tokenText += ` => trailingTrivia: ${
          node.trailingTrivia.map((t) => `"${t.text.replace(/\n/g, "\\n")}"`)
            .join(", ")
        }`;
      }

      logger.debug(
        "visit: %s %s%s",
        indent,
        NodeKind[node.nodeKind],
        tokenText,
      );
    }

    if (node.isComposite) {
      const compositeNode = node as AbstractCompositeNode;

      this.nodeHandler.beforeVisit(compositeNode);

      for (const childNode of compositeNode.children) {
        this.depth++;
        this.visit(childNode);
        this.depth--;
      }

      this.nodeHandler.afterVisit(compositeNode);
    } else {
      this.nodeHandler.visit(node as AbstractLeafNode);
    }
  }
}
