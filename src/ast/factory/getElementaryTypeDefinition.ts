import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { ElementaryTypeDefinition } from "../node/ElementaryTypeDefinition.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { AlignedModifier } from "../node/AlignedModifier.ts";
import type { LengthAttribute } from "../node/LengthAttribute.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getElementaryTypeDefinition(
  cursor: TreeCursor,
  text: Text,
): ElementaryTypeDefinition {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  let reservedKeyword: Token | undefined;
  let legacyKeyword: Token | undefined;
  let constKeyword: Token | undefined;
  let alignedModifier: AlignedModifier | undefined;
  let lengthAttribute: LengthAttribute | undefined;
  let lookAheadOperator: Token | undefined;
  let elementaryType: ElementaryType | undefined;
  let identifier: Identifier | undefined;
  let assignmentOperator: Token | undefined;
  let value: AbstractExpression | Identifier | NumberLiteral | undefined;
  let endValue: AbstractExpression | Identifier | NumberLiteral | undefined;
  let rangeOperator: Token | undefined;
  let semicolonPunctuator: Token | undefined;

  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.ALIGNED_MODIFIER:
          alignedModifier = childNodeOrToken as AlignedModifier;
          break;
        case NodeKind.ELEMENTARY_TYPE:
          elementaryType = childNodeOrToken as ElementaryType;
          break;
        case NodeKind.LENGTH_ATTRIBUTE:
          lengthAttribute = childNodeOrToken as LengthAttribute;
          break;
        case NodeKind.IDENTIFIER:
          if (identifier === undefined) {
            identifier = childNodeOrToken as Identifier;
          } else if (value == undefined) {
            value = childNodeOrToken as AbstractExpression;
          } else {
            endValue = childNodeOrToken as AbstractExpression;
          }
          break;
        case NodeKind.EXPRESSION:
          if (value == undefined) {
            value = childNodeOrToken as AbstractExpression;
          } else {
            endValue = childNodeOrToken as AbstractExpression;
          }
          break;
        case NodeKind.NUMBER_LITERAL:
          if (value == undefined) {
            value = childNodeOrToken as NumberLiteral;
          } else {
            endValue = childNodeOrToken as NumberLiteral;
          }
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "reserved":
          reservedKeyword = childNodeOrToken;
          break;
        case "legacy":
          legacyKeyword = childNodeOrToken;
          break;
        case "const":
          constKeyword = childNodeOrToken;
          break;
        case "*":
          lookAheadOperator = childNodeOrToken;
          break;
        case "=":
          assignmentOperator = childNodeOrToken;
          break;
        case "..":
          rangeOperator = childNodeOrToken;
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
    throw new InternalParseError("Expected elementaryType to be defined");
  }
  if (identifier === undefined) {
    throw new InternalParseError("Expected identifier to be defined");
  }
  if (lengthAttribute === undefined) {
    throw new InternalParseError("Expected lengthAttribute to be defined");
  }
  if (semicolonPunctuator === undefined) {
    throw new InternalParseError("Expected semicolonPunctuator to be defined");
  }

  return new ElementaryTypeDefinition(
    reservedKeyword !== undefined,
    legacyKeyword !== undefined,
    constKeyword !== undefined,
    alignedModifier,
    elementaryType,
    lengthAttribute,
    lookAheadOperator !== undefined,
    identifier,
    value,
    endValue,
    reservedKeyword,
    legacyKeyword,
    constKeyword,
    lookAheadOperator,
    assignmentOperator,
    rangeOperator,
    semicolonPunctuator,
  );
}
