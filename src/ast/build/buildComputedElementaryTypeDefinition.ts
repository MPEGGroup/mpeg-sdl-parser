import { InternalParseError } from "../../ParseError.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { ComputedElementaryTypeDefinition } from "../node/ComputedElementaryTypeDefinition.ts";
import type { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { TokenKind } from "../node/enum/token_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { Token } from "../node/Token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import type { OptionalNode } from "../util/types.ts";
import type { BuildContext } from "./BuildContext.ts";

export function buildComputedElementaryTypeDefinition(
  buildContext: BuildContext,
): ComputedElementaryTypeDefinition {
  const children: Array<AbstractNode> = [];

  const computedKeyword = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.COMPUTED,
  );

  children.push(computedKeyword);

  const constKeyword = fetchOptionalNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CONST,
  );

  if (constKeyword !== undefined) {
    children.push(constKeyword);
  }

  const elementaryType = fetchRequiredNode<ElementaryType>(
    buildContext,
    NodeKind.ELEMENTARY_TYPE,
  );

  children.push(elementaryType);

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

  if (assignmentOperator !== undefined) {
    children.push(assignmentOperator);

    value = fetchOptionalNode<
      AbstractExpression | Identifier | NumberLiteral
    >(
      buildContext,
      [
        NodeKind.EXPRESSION,
        NodeKind.IDENTIFIER,
        NodeKind.NUMBER_LITERAL,
      ],
    );
    if (value !== undefined) {
      children.push(value);
    } else {
      throw new InternalParseError(
        "Expected value for computed elementary type definition after assignment operator",
        (assignmentOperator as Token).location,
      );
    }
  }

  const semicolonPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.SEMICOLON,
  );
  children.push(semicolonPunctuator);

  return new ComputedElementaryTypeDefinition(
    computedKeyword,
    constKeyword,
    elementaryType,
    identifier,
    assignmentOperator,
    value,
    semicolonPunctuator,
    children,
  );
}
