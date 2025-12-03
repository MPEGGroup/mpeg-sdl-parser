import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import type { AbstractNode } from "../node/AbstractNode.ts";

/**
 * State storage while building the AST.
 *
 * @interface BuildContext
 * @property {TreeCursor} cursor - The current position in the parse tree.
 * @property {Text} text - The source text that was parsed.
 * @property {boolean} lenient - Whether to build the AST leniently, allowing error nodes.
 * @property {AbstractNode[]} nextNodes - The next AST nodes which have been built from the parse tree.
 * @property {number} depth - The current depth in the parse tree during AST construction.
 * @property {boolean | undefined} isEndOfSiblings - Whether the end of sibling nodes for the current parent node has been reached.
 */
export interface BuildContext {
  readonly cursor: TreeCursor;
  readonly text: Text;
  readonly lenient: boolean;
  nextNodes: AbstractNode[];
  isEndOfSiblings?: boolean;
  depth: number;
}
