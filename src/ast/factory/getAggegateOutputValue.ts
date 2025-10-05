import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import { AggregateOutputValue } from "../node/AggregateOutputValue.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { ElementaryTypeOutputValue } from "../node/ElementaryTypeOutputValue.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getAggregateOutputValue(
  cursor: TreeCursor,
  text: Text,
): AggregateOutputValue {
  const outputValues:
    (AggregateOutputValue | NumberLiteral | ElementaryTypeOutputValue)[] = [];
  let openBracePunctuator: Token | undefined;
  let commaPunctuators: Token[] | undefined;
  let closeBracePunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.AGGREGATE_OUTPUT_VALUE:
          outputValues.push(childNodeOrToken as AggregateOutputValue);
          break;
        case NodeKind.NUMBER_LITERAL:
          outputValues.push(childNodeOrToken as NumberLiteral);
          break;
        case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
          outputValues.push(childNodeOrToken as ElementaryTypeOutputValue);
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "{":
          openBracePunctuator = childNodeOrToken;
          break;
        case ",":
          if (commaPunctuators === undefined) {
            commaPunctuators = [];
          }
          commaPunctuators.push(childNodeOrToken);
          break;
        case "}":
          closeBracePunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (openBracePunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument openBracePunctuator to be defined",
    );
  }

  if (closeBracePunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument closeBracePunctuator to be defined",
    );
  }

  return new AggregateOutputValue(
    outputValues,
    openBracePunctuator,
    commaPunctuators,
    closeBracePunctuator,
  );
}
