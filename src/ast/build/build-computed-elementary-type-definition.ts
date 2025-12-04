import { InternalParseError } from "../../parse-error.ts";
import type { AbstractExpression } from "../node/abstract-expression.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { ComputedElementaryTypeDefinition } from "../node/computed-elementary-type-definition.ts";
import type { ElementaryType } from "../node/elementary-type.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { TokenKind } from "../node/enum/token-kind.ts";
import type { Identifier } from "../node/identifier.ts";
import type { NumberLiteral } from "../node/number-literal.ts";
import type { Token } from "../node/token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
import type { OptionalNode } from "../util/types.ts";
import type { BuildContext } from "./build-context.ts";

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
