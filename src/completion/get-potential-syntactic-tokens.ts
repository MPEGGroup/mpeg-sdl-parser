import type { TreeCursor } from "@lezer/common";
import { getPotentialTokenTypeIds } from "./get-potential-token-type-ids.ts";
import { potentialSyntacticTokensByTokenTypeId } from "./completion-rules.ts";
import getLogger from "../util/logger.ts";

const logger = getLogger("getPotentialSyntacticTokens");

/**
 * Given a TreeCursor positioned at a node, returns the potential syntactic tokens at that position.
 *
 * @param cursor A TreeCursor positioned at a node.
 *
 * @returns An array of potential syntactic tokens, or undefined if none found.
 */
export function getPotentialSyntacticTokens(
  cursor: TreeCursor,
): string[] | undefined {
  const potentialTokenTypeIds = getPotentialTokenTypeIds(cursor);

  if (!potentialTokenTypeIds || (potentialTokenTypeIds.length === 0)) {
    logger.debug(
      "No potentialTokenTypeIds so no potential syntactic tokens"
    );
    return undefined;
  }

  const potentialSyntacticTokens: string[] = [];

  potentialTokenTypeIds.forEach((potentialTokenTypeId) => {
    const syntacticTokens = potentialSyntacticTokensByTokenTypeId.get(
      potentialTokenTypeId,
    );

    if (syntacticTokens) {
      potentialSyntacticTokens.push(...syntacticTokens);
    }
  });

  if (potentialSyntacticTokens.length === 0) {
    logger.debug(
      "No potential syntactic tokens"
    );
    return undefined;
  }
  
  // sort and remove duplicates
  const uniqueSortedTokens = Array.from(new Set(potentialSyntacticTokens)).sort();

  logger.debug(
    `Potential syntactic tokens: ${uniqueSortedTokens.join(" ")}`
  );
  return uniqueSortedTokens;
}
