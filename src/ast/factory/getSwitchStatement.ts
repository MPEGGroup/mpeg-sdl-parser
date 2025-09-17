import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Token } from "../token/Token.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Identifier } from "../node/Identifier.ts";
import { SwitchStatement } from "../node/SwitchStatement.ts";
import { CaseClause } from "../node/CaseClause.ts";
import { DefaultClause } from "../node/DefaultClause.ts";

export function getSwitchStatement(
  cursor: TreeCursor,
  text: Text,
): SwitchStatement {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let expression: AbstractExpression | NumberLiteral | Identifier | undefined;
  const caseClauses: CaseClause[] = [];
  let defaultClause: DefaultClause | undefined;
  let switchKeyword: Token | undefined;
  let openParenthesisPunctuator: Token | undefined;
  let closeParenthesisPunctuator: Token | undefined;
  let openBracePunctuator: Token | undefined;
  let closeBracePunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          expression = childNodeOrToken as Identifier;
          break;
        case NodeKind.NUMBER_LITERAL:
          expression = childNodeOrToken as NumberLiteral;
          break;
        case NodeKind.EXPRESSION:
          expression = childNodeOrToken as AbstractExpression;
          break;
        case NodeKind.CASE_CLAUSE:
          caseClauses.push(childNodeOrToken as CaseClause);
          break;
        case NodeKind.DEFAULT_CLAUSE:
          defaultClause = childNodeOrToken as DefaultClause;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "switch":
          switchKeyword = childNodeOrToken;
          break;
        case "(":
          openParenthesisPunctuator = childNodeOrToken;
          break;
        case ")":
          closeParenthesisPunctuator = childNodeOrToken;
          break;
        case "{":
          openBracePunctuator = childNodeOrToken;
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

  if (!expression) {
    throw new InternalParseError("Expected argument expression to be defined");
  }
  if (!switchKeyword) {
    throw new InternalParseError(
      "Expected argument switchKeyword to be defined",
    );
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
  if (!openBracePunctuator) {
    throw new InternalParseError(
      "Expected argument openBracePunctuator to be defined",
    );
  }
  if (!closeBracePunctuator) {
    throw new InternalParseError(
      "Expected argument closeBracePunctuator to be defined",
    );
  }
  return new SwitchStatement(
    expression,
    caseClauses,
    defaultClause,
    switchKeyword,
    openParenthesisPunctuator,
    closeParenthesisPunctuator,
    openBracePunctuator,
    closeBracePunctuator,
  );
}
