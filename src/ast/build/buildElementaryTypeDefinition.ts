import { InternalParseError } from "../../ParseError.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import { ElementaryTypeDefinition } from "../node/ElementaryTypeDefinition.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { AlignedModifier } from "../node/AlignedModifier.ts";
import type { LengthAttribute } from "../node/LengthAttribute.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { Token } from "../node/Token.ts";
import type { OptionalNode } from "../util/types.ts";

export function buildElementaryTypeDefinition(
  buildContext: BuildContext,
): ElementaryTypeDefinition {
  const children: Array<AbstractNode> = [];

  const reservedKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.RESERVED,
  );

  if (reservedKeyword !== undefined) {
    children.push(reservedKeyword);
  }

  const legacyKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.LEGACY,
  );
  if (legacyKeyword !== undefined) {
    children.push(legacyKeyword);
  }

  const constKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CONST,
  );
  if (constKeyword !== undefined) {
    children.push(constKeyword);
  }

  const alignedModifier = fetchOptionalNode<AlignedModifier>(
    buildContext,
    NodeKind.ALIGNED_MODIFIER,
  );
  if (alignedModifier !== undefined) {
    children.push(alignedModifier);
  }
  const elementaryType = fetchRequiredNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );
  children.push(elementaryType);

  const lengthAttribute = fetchRequiredNode<LengthAttribute>(
    buildContext,
    NodeKind.LENGTH_ATTRIBUTE,
  );

  children.push(lengthAttribute);
  const lookAheadOperator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.LOOK_AHEAD,
  );

  if (lookAheadOperator !== undefined) {
    children.push(lookAheadOperator);
  }

  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );

  children.push(identifier);

  const assignmentOperator = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.ASSIGNMENT,
  );

  let value: OptionalNode<AbstractExpression | Identifier | NumberLiteral> =
    undefined;
  let rangeOperator: OptionalNode<Token> = undefined;
  let endValue: OptionalNode<AbstractExpression | Identifier | NumberLiteral> =
    undefined;

  if (assignmentOperator !== undefined) {
    children.push(assignmentOperator);

    value = fetchOptionalNode<AbstractExpression | Identifier | NumberLiteral>(
      buildContext,
      [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
    );
    if (value !== undefined) {
      children.push(value);
    } else {
      throw new InternalParseError(
        "Expected value for elementary type definition after assignment operator",
        (assignmentOperator as Token).location,
      );
    }
    rangeOperator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.RANGE_OPERATOR,
    );
    if (rangeOperator !== undefined) {
      children.push(rangeOperator);

      endValue = fetchOptionalNode<
        AbstractExpression | Identifier | NumberLiteral
      >(
        buildContext,
        [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
      );

      if (endValue !== undefined) {
        children.push(endValue);
      } else {
        throw new InternalParseError(
          "Expected end value for elementary type definition after range operator",
          (rangeOperator as Token).location,
        );
      }
    }
  }

  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );

  children.push(semicolonPunctuator);

  return new ElementaryTypeDefinition(
    reservedKeyword,
    legacyKeyword,
    constKeyword,
    alignedModifier,
    elementaryType,
    lengthAttribute,
    lookAheadOperator,
    identifier,
    assignmentOperator,
    value,
    rangeOperator,
    endValue,
    semicolonPunctuator,
    children,
  );
}
