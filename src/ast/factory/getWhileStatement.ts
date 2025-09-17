import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import { WhileStatement } from "../node/WhileStatement.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";

export function getWhileStatement(
  cursor: TreeCursor,
  text: Text,
): WhileStatement {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let condition: AbstractExpression | NumberLiteral | Identifier | undefined;
  let compoundStatement: CompoundStatement | undefined;
  let whileKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closeParenthesisPunctuator: Token | undefined;

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
          if (
            (childNodeOrToken as AbstractStatement).statementKind ===
              StatementKind.COMPOUND
          ) {
            compoundStatement = childNodeOrToken as CompoundStatement;
          } else {
            throw new InternalParseError(
              `Unexpected statement kind: ${
                (childNodeOrToken as AbstractStatement).statementKind
              }`,
            );
          }
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "while":
          whileKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
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

  if (condition === undefined) {
    throw new InternalParseError("Expected argument condition to be defined");
  }
  if (compoundStatement === undefined) {
    throw new InternalParseError(
      "Expected argument compoundStatement to be defined",
    );
  }
  if (whileKeyword === undefined) {
    throw new InternalParseError(
      "Expected argument whileKeyword to be defined",
    );
  }
  if (openParenthesisPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument openParenthesisPunctuator to be defined",
    );
  }
  if (closeParenthesisPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument closeParenthesisPunctuator to be defined",
    );
  }
  return new WhileStatement(
    condition,
    compoundStatement,
    whileKeyword,
    openParenthesisPunctuator,
    closeParenthesisPunctuator,
  );
}
