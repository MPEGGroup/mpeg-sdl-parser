import type { TreeCursor } from "@lezer/common";
import { getPotentialTokenTypeIds } from "./get-potential-token-type-ids.ts";
import { potentialSyntacticTokensByTokenTypeId } from "./completion-rules.ts";

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

  if (!potentialTokenTypeIds) {
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

  // sort and remove duplicates
  return Array.from(new Set(potentialSyntacticTokens)).sort();
}
