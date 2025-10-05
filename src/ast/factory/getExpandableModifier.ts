import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { ExpandableModifier } from "../node/ExpandableModifier.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getExpandableModifier(
  cursor: TreeCursor,
  text: Text,
): ExpandableModifier {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let maxClassSize: NumberLiteral | undefined;
  let expandableKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closedParenthesisPunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind === NodeKind.NUMBER_LITERAL) {
        maxClassSize = childNodeOrToken as NumberLiteral;
      } else {
        throw new InternalParseError(
          `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
        );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "expandable":
          expandableKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ")":
          closedParenthesisPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (expandableKeyword === undefined) {
    throw new InternalParseError("Expected expandable keyword to be defined");
  }
  return new ExpandableModifier(
    maxClassSize,
    expandableKeyword,
    openParenthesisPunctuator,
    closedParenthesisPunctuator,
  );
}
