import { isCompositeNode, isToken } from "../util/types.ts";
import { AbstractNode } from "./AbstractNode.ts";
import { NodeKind } from "./enum/node_kind.ts";
import type { Token } from "./Token.ts";

/**
 * Represents an abstract composite node in the abstract syntax tree.
 * This class extends the `AbstractNode` class and provides a base for nodes
 * that can have child nodes.
 */
export abstract class AbstractCompositeNode extends AbstractNode {
  public startToken: Token | undefined;
  public endToken: Token | undefined;

  constructor(
    nodeKind: NodeKind,
    public readonly children: Array<AbstractNode>,
  ) {
    super(nodeKind, true);

    if (children.length === 0) {
      return;
    }

    const firstChild = children[0];
    if (isCompositeNode(firstChild)) {
      this.startToken = firstChild.startToken;
    } else if (isToken(firstChild)) {
      this.startToken = firstChild;
    } else {
      throw new Error(
        "Unsupported node type for start token assignment: " +
          NodeKind[firstChild.nodeKind],
      );
    }
    const lastChild = children[children.length - 1];
    if (isCompositeNode(lastChild)) {
      this.endToken = lastChild.endToken;
    } else if (isToken(lastChild)) {
      this.endToken = lastChild;
    } else {
      throw new Error(
        "Unsupported node type for end token assignment: " +
          NodeKind[lastChild.nodeKind],
      );
    }
  }
}
