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
import { DoStatement } from "../node/DoStatement.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";

export function getDoStatement(
  cursor: TreeCursor,
  text: Text,
): DoStatement {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let condition: AbstractExpression | NumberLiteral | Identifier | undefined;
  let compoundStatement: CompoundStatement | undefined;
  let doKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closeParenthesisPunctuator: Token | undefined;
  let whileKeyword: Token | undefined;
  let semicolonPunctuator: Token | undefined;

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
        case "do":
          doKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ")":
          closeParenthesisPunctuator = childNodeOrToken;
          break;
        case "while":
          whileKeyword = childNodeOrToken;
          break;
        case ";":
          semicolonPunctuator = childNodeOrToken;
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
  if (!compoundStatement) {
    throw new InternalParseError(
      "Expected argument compoundStatement to be defined",
    );
  }
  if (!doKeyword) {
    throw new InternalParseError("Expected argument doKeyword to be defined");
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
  if (!whileKeyword) {
    throw new InternalParseError(
      "Expected argument whileKeyword to be defined",
    );
  }
  if (!semicolonPunctuator) {
    throw new InternalParseError(
      "Expected argument semicolonPunctuator to be defined",
    );
  }

  return new DoStatement(
    compoundStatement,
    condition,
    doKeyword,
    whileKeyword,
    openParenthesisPunctuator,
    closeParenthesisPunctuator,
    semicolonPunctuator,
  );
}
