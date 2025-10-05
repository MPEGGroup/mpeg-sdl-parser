import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { ForStatement } from "../node/ForStatement.ts";
import { ComputedElementaryTypeDefinition } from "../node/ComputedElementaryTypeDefinition.ts";
import { CompoundStatement } from "../node/CompoundStatement.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getForStatement(
  cursor: TreeCursor,
  text: Text,
): ForStatement {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let expression1: AbstractExpression | undefined;
  let computedElementaryTypeDefinition:
    | ComputedElementaryTypeDefinition
    | undefined;
  let expression2: AbstractExpression | undefined;
  let expression3: AbstractExpression | undefined;
  let compoundStatement: CompoundStatement | undefined;
  let forKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let semicolon1Punctuator: Token | undefined;
  let semicolon2Punctuator: Token | undefined;
  let closeParenthesisPunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.EXPRESSION:
          if (semicolon2Punctuator) {
            expression3 = childNodeOrToken as AbstractExpression;
          } else if (semicolon1Punctuator || computedElementaryTypeDefinition) {
            expression2 = childNodeOrToken as AbstractExpression;
          } else {
            expression1 = childNodeOrToken as AbstractExpression;
          }
          break;
        case NodeKind.STATEMENT:
          if (
            (childNodeOrToken as AbstractStatement).statementKind ===
              StatementKind.COMPOUND
          ) {
            compoundStatement = childNodeOrToken as CompoundStatement;
          } else if (
            (childNodeOrToken as AbstractStatement).statementKind ===
              StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION
          ) {
            computedElementaryTypeDefinition =
              childNodeOrToken as ComputedElementaryTypeDefinition;
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
        case "for":
          forKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ";":
          if (!semicolon1Punctuator && !computedElementaryTypeDefinition) {
            semicolon1Punctuator = childNodeOrToken;
          } else {
            semicolon2Punctuator = childNodeOrToken;
          }
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

  if (!compoundStatement) {
    throw new InternalParseError(
      "Expected argument compoundStatement to be defined",
    );
  }
  if (!forKeyword) {
    throw new InternalParseError("Expected argument forKeyword to be defined");
  }
  if (!openParenthesisPunctuator) {
    throw new InternalParseError(
      "Expected argument openParenthesisPunctuator to be defined",
    );
  }
  if (!semicolon2Punctuator) {
    throw new InternalParseError(
      "Expected argument semicolon2Punctuator to be defined",
    );
  }
  if (!closeParenthesisPunctuator) {
    throw new InternalParseError(
      "Expected argument closeParenthesisPunctuator to be defined",
    );
  }

  return new ForStatement(
    expression1,
    computedElementaryTypeDefinition,
    expression2,
    expression3,
    compoundStatement,
    forKeyword,
    openParenthesisPunctuator,
    semicolon1Punctuator,
    semicolon2Punctuator,
    closeParenthesisPunctuator,
  );
}
