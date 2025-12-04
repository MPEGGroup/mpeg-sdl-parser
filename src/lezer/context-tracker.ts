import { ContextTracker, LRParser as LezerParser } from "@lezer/lr";
import getLogger from "../util/logger.ts";

const logger = getLogger("contextTracker");

/*
 * Define a custom context tracker for debug logging via the framework wide logger
 */
export function getContextTracker(parser: LezerParser): ContextTracker<number> {
  const contextTracker = new ContextTracker<number>({
    start: 0,
    shift: (_context, term, stack, _input) => {
      const termName = parser.getName(term) ?? "unknown";

      logger.debug("shift term: %s at position %d", termName, stack.pos);

      return 0;
    },
    reduce: (_context, term, stack, _input) => {
      const termName = parser.getName(term) ?? "unknown";

      logger.debug("reduce term: %s at position %d", termName, stack.pos);

      return 0;
    },
    reuse: (_context, node, stack, _input) => {
      const nodeName = parser.getName(node.type.id) ?? "unknown";

      logger.debug("reuse node: %s at position %d", nodeName, stack.pos);

      return 0;
    },
    strict: false,
  });

  return contextTracker;
}

export const defaultContextTracker = new ContextTracker<number>({
  start: 0,
  shift: (_context, _term, _stack, _input) => 0,
  reduce: (_context, _term, _stack, _input) => 0,
  reuse: (_context, _node, _stack, _input) => 0,
  strict: false,
});
