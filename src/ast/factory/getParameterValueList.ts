import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import { ParameterValueList } from "../node/ParameterValueList.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";

export function getParameterValueList(
  cursor: TreeCursor,
  text: Text,
): ParameterValueList {
  const values: (AbstractExpression | Identifier | NumberLiteral)[] = [];
  let openParenthesisPunctuator: Token | undefined;
  let commaPunctuators: Token[] | undefined;
  let closeParenthesisPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          values.push(childNodeOrToken as Identifier);
          break;
        case NodeKind.NUMBER_LITERAL:
          values.push(childNodeOrToken as NumberLiteral);
          break;
        case NodeKind.EXPRESSION:
          values.push(childNodeOrToken as AbstractExpression);
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ",":
          if (commaPunctuators === undefined) {
            commaPunctuators = [];
          }
          commaPunctuators.push(childNodeOrToken);
          break;
        case ")":
          closeParenthesisPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (values.length === 0) {
    throw new InternalParseError(
      "Expected at least one value in parameter value list",
    );
  }
  if (openParenthesisPunctuator === undefined) {
    throw new InternalParseError(
      "Expected openParenthesisPunctuator to be defined",
    );
  }
  if (closeParenthesisPunctuator === undefined) {
    throw new InternalParseError(
      "Expected closeParenthesisPunctuator to be defined",
    );
  }
  return new ParameterValueList(
    values,
    openParenthesisPunctuator,
    commaPunctuators,
    closeParenthesisPunctuator,
  );
}
