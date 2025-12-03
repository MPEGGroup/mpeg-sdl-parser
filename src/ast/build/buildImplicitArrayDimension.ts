import { InternalParseError } from "../../ParseError.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import { ImplicitArrayDimension } from "../node/ImplicitArrayDimension.ts";
import type { AbstractExpression } from "../node/AbstractExpression.ts";
import type { NumberLiteral } from "../node/NumberLiteral.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import type { OptionalNode } from "../util/types.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

export function buildImplicitArrayDimension(
  buildContext: BuildContext,
): ImplicitArrayDimension {
  const children: Array<AbstractNode> = [];

  const openBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.OPEN_BRACE,
  );
  children.push(openBracketPunctuator);
  const rangeStart = fetchOptionalNode<
    AbstractExpression | NumberLiteral | Identifier
  >(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  let rangeOperator: OptionalNode<Token> = undefined;
  let rangeEnd: OptionalNode<
    AbstractExpression | NumberLiteral | Identifier
  > = undefined;
  if (rangeStart) {
    children.push(rangeStart);
    rangeOperator = fetchOptionalNode<Token>(
      buildContext,
      NodeKind.TOKEN,
      TokenKind.RANGE_OPERATOR,
    );
    if (rangeOperator) {
      children.push(rangeOperator);
    } else {
      throw new InternalParseError(
        "Expected range operator after range start in implicit array dimension",
      );
    }
    rangeEnd = fetchOptionalNode<
      AbstractExpression | NumberLiteral | Identifier
    >(
      buildContext,
      [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
    );
    if (rangeStart) {
      children.push(rangeStart);
    } else {
      throw new InternalParseError(
        "Expected range end after range operator in implicit array dimension",
      );
    }
  }
  const closeBracketPunctuator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.CLOSE_BRACKET,
  );
  children.push(closeBracketPunctuator);

  return new ImplicitArrayDimension(
    openBracketPunctuator,
    rangeStart,
    rangeOperator,
    rangeEnd,
    closeBracketPunctuator,
    children,
  );
}
