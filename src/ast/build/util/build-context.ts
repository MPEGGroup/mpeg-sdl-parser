import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import type { AbstractNode } from "../../node/abstract-node.ts";
import type { Trivia } from "../../node/trivia.ts";

/**
 * State information used during AST construction.
 *
 * @interface State
 * @property {boolean} isEndOfSiblings - Indicates if there are no more sibling nodes to process.
 * @property {AbstractNode} [nextNode] - The next node to be processed, if applicable.
 * @property {string} indent - The current indentation level for logging purposes.
 */
export interface State {
  isEndOfSiblings: boolean;
  nextNode?: AbstractNode;
  indent: string;
}

/**
 * State storage while building the AST.
 *
 * @interface BuildContext
 * @property {TreeCursor} cursor - The current position in the parse tree.
 * @property {Text} text - The source text that was parsed.
 * @property {boolean} lenient - Whether to build the AST leniently, allowing error nodes.
 * @property {State[]} stateStack - A stack of states used during AST construction.
 * @property {Trivia[]} [unconsumedTrivia] - Any trivia not consumed. This should only be present for trailing trivia after the root node.
 */
export interface BuildContext {
  readonly cursor: TreeCursor;
  readonly text: Text;
  readonly lenient: boolean;
  stateStack: State[];
  unconsumedTrivia?: Trivia[];
}
