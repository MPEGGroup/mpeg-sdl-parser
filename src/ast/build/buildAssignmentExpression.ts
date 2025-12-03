import { NodeKind } from "../node/enum/node_kind.ts";
import { BinaryExpression } from "../node/BinaryExpression.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import type { Token } from "../node/Token.ts";
import { fetchRequiredNode } from "../util/fetchNode.ts";
import { TokenKind } from "../node/enum/token_kind.ts";

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
