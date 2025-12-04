import { NodeKind } from "../node/enum/node-kind.ts";
import { BinaryExpression } from "../node/binary-expression.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import type { Token } from "../node/token.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import { TokenKind } from "../node/enum/token-kind.ts";

export function buildAssignmentExpression(
  buildContext: BuildContext,
): BinaryExpression {
  const children: Array<AbstractNode> = [];

  const leftOperand = fetchRequiredNode<Token>(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(leftOperand);

  const assignmentOperator = fetchRequiredNode<Token>(
    buildContext,
    NodeKind.TOKEN,
    TokenKind.ASSIGNMENT,
  );
  children.push(assignmentOperator);

  const rightOperand = fetchRequiredNode<Token>(
    buildContext,
    [NodeKind.EXPRESSION, NodeKind.IDENTIFIER, NodeKind.NUMBER_LITERAL],
  );
  children.push(rightOperand);

  return new BinaryExpression(
    leftOperand,
    assignmentOperator,
    rightOperand,
    children,
  );
}
