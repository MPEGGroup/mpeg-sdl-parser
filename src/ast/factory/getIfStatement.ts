import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { IfStatement } from "../node/IfStatement.ts";
import type { Token } from "../token/Token.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getIfStatement(
  cursor: TreeCursor,
  text: Text,
): IfStatement {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let condition: AbstractExpression | NumberLiteral | Identifier | undefined;
  let ifStatement: AbstractStatement | undefined;
  let elseStatement: AbstractStatement | undefined;
  let ifKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closeParenthesisPunctuator: Token | undefined;
  let elseKeyword: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          condition = childNodeOrToken as Identifier;
          break;
        case NodeKind.NUMBER_LITERAL:
          condition = childNodeOrToken as NumberLiteral;
          break;
        case NodeKind.EXPRESSION:
          condition = childNodeOrToken as AbstractExpression;
          break;
        case NodeKind.STATEMENT:
          if (ifStatement) {
            elseStatement = childNodeOrToken as AbstractStatement;
          } else {
            ifStatement = childNodeOrToken as AbstractStatement;
          }
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "if":
          ifKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ")":
          closeParenthesisPunctuator = childNodeOrToken;
          break;
        case "else":
          elseKeyword = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (!condition) {
    throw new InternalParseError("Expected argument condition to be defined");
  }

  if (!ifStatement) {
    throw new InternalParseError("Expected argument ifStatement to be defined");
  }

  if (!ifKeyword) {
    throw new InternalParseError("Expected argument ifKeyword to be defined");
  }

  if (!openParenthesisPunctuator) {
    throw new InternalParseError(
      "Expected argument openParenthesisPunctuator to be defined",
    );
  }

  if (!closeParenthesisPunctuator) {
    throw new InternalParseError(
      "Expected argument closeParenthesisPunctuator to be defined",
    );
  }

  return new IfStatement(
    condition,
    ifStatement,
    elseStatement,
    ifKeyword,
    openParenthesisPunctuator,
    closeParenthesisPunctuator,
    elseKeyword,
  );
}
