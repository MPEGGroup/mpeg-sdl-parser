import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { ComputedElementaryTypeDefinition } from "../node/ComputedElementaryTypeDefinition.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";

export function getComputedElementaryTypeDefinition(
  cursor: TreeCursor,
  text: Text,
): ComputedElementaryTypeDefinition {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let constKeyword: Token | undefined;
  let computedKeyword: Token | undefined;
  let elementaryType: ElementaryType | undefined;
  let identifier: Identifier | undefined;
  let assignmentOperator: Token | undefined;
  let value: AbstractExpression | Identifier | NumberLiteral | undefined;
  let semicolonPunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.ELEMENTARY_TYPE:
          elementaryType = childNodeOrToken as ElementaryType;
          break;
        case NodeKind.IDENTIFIER:
          if (identifier === undefined) {
            identifier = childNodeOrToken as Identifier;
          } else if (value == undefined) {
            value = childNodeOrToken as AbstractExpression;
          }
          break;
        case NodeKind.EXPRESSION:
          value = childNodeOrToken as AbstractExpression;
          break;
        case NodeKind.NUMBER_LITERAL:
          value = childNodeOrToken as NumberLiteral;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "computed":
          computedKeyword = childNodeOrToken;
          break;
        case "const":
          constKeyword = childNodeOrToken;
          break;
        case "=":
          assignmentOperator = childNodeOrToken;
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

  if (elementaryType === undefined) {
    throw new InternalParseError(
      "Expected argument elementaryType to be defined",
    );
  }
  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }
  if (computedKeyword === undefined) {
    throw new InternalParseError(
      "Expected argument computedKeyword to be defined",
    );
  }

  if (semicolonPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument semicolonPunctuator to be defined",
    );
  }
  return new ComputedElementaryTypeDefinition(
    constKeyword !== undefined,
    elementaryType,
    identifier,
    value,
    computedKeyword,
    constKeyword,
    assignmentOperator,
    semicolonPunctuator,
  );
}
