import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractExpression } from "../ast/node/AbstractExpression.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ArrayElementAccess } from "../ast/node/ArrayElementAccess.ts";
import type { ClassMemberAccess } from "../ast/node/ClassMemberAccess.ts";
import { ExpressionKind } from "../ast/node/enum/expression_kind.ts";
import type { LengthofExpression } from "../ast/node/LengthofExpression.ts";
import type { BinaryExpression } from "../ast/node/BinaryExpression.ts";
import type { UnaryExpression } from "../ast/node/UnaryExpression.ts";
const { join } = doc.builders;

export function printClassMemberAccess(
  path: AstPath<ClassMemberAccess>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return [
    getDocWithTrivia(node.classMemberAccessOperator),
    path.call(print, "memberIdentifier"),
  ];
}

export function printArrayElementAccess(
  path: AstPath<ArrayElementAccess>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const arrayElementAccess = path.node;
  return [
    getDocWithTrivia(arrayElementAccess.openBracketPunctuator),
    path.call(print, "index"),
    getDocWithTrivia(arrayElementAccess.closeBracketPunctuator),
  ];
}

function printUnaryExpression(
  path: AstPath<UnaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const unaryExpression = path.node;

  const elements = [];

  if (unaryExpression.unaryOperator !== undefined) {
    elements.push(
      getDocWithTrivia(unaryExpression.unaryOperator),
    );
  }

  if (unaryExpression.openParenthesisPunctuator !== undefined) {
    elements.push(
      getDocWithTrivia(unaryExpression.openParenthesisPunctuator),
    );
  }

  elements.push([
    path.call(
      print,
      "operand" as keyof UnaryExpression["operand"],
    ),
  ]);

  if (unaryExpression.arrayElementAccess !== undefined) {
    elements.push(
      path.call(
        print,
        "arrayElementAccess" as keyof UnaryExpression["arrayElementAccess"],
      ),
    );
  }

  if (unaryExpression.classMemberAccess !== undefined) {
    elements.push(
      path.call(
        print,
        "classMemberAccess" as keyof UnaryExpression["classMemberAccess"],
      ),
    );
  }

  if (unaryExpression.closeParenthesisPunctuator !== undefined) {
    elements.push(
      getDocWithTrivia(unaryExpression.closeParenthesisPunctuator),
    );
  }

  if (unaryExpression.postfixOperator !== undefined) {
    elements.push(
      getDocWithTrivia(unaryExpression.postfixOperator),
    );
  }

  return elements;
}

function printBinaryExpression(
  path: AstPath<BinaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  return join(" ", [
    path.call(print, "leftOperand"),
    getDocWithTrivia(node.binaryOperator),
    path.call(print, "rightOperand"),
  ]);
}

function printLengthOfExpression(
  path: AstPath<LengthofExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const lengthOfExpression = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(lengthOfExpression.lengthOfKeyword));
  elements.push(
    getDocWithTrivia(lengthOfExpression.openParenthesisPunctuator),
  );
  elements.push(path.call(print, "operand"));
  elements.push(
    getDocWithTrivia(lengthOfExpression.closeParenthesisPunctuator),
  );

  return elements;
}

export function printAbstractExpression(
  path: AstPath<AbstractExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { expressionKind } = path.node;
  switch (expressionKind) {
    case ExpressionKind.BINARY:
      return printBinaryExpression(path as AstPath<BinaryExpression>, print);
    case ExpressionKind.LENGTHOF:
      return printLengthOfExpression(
        path as AstPath<LengthofExpression>,
        print,
      );
    case ExpressionKind.UNARY:
      return printUnaryExpression(path as AstPath<UnaryExpression>, print);
    default: {
      const exhaustiveCheck: never = expressionKind;
      throw new Error(
        "Unreachable code reached, expressionKind == " + exhaustiveCheck,
      );
    }
  }
}
