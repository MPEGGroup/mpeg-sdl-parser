import { AstPath, type Doc, doc } from "prettier";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print_utils.ts";
import type { AbstractExpression } from "../ast/node/AbstractExpression.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import { ExpressionKind } from "../ast/node/enum/expression_kind.ts";
import type { LengthofExpression } from "../ast/node/length-of-expression.ts";
import type { BinaryExpression } from "../ast/node/BinaryExpression.ts";
import type { UnaryExpression } from "../ast/node/UnaryExpression.ts";

const { fill } = doc.builders;
type IfBreak = doc.builders.IfBreak;

function printUnaryExpression(
  path: AstPath<UnaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc[] {
  const unaryExpression = path.node;

  const docs = [];

  if (unaryExpression.unaryOperator !== undefined) {
    docs.push(
      path.call(
        print,
        "unaryOperator" as keyof UnaryExpression["unaryOperator"],
      ),
    );
  }

  if (unaryExpression.openParenthesisPunctuator !== undefined) {
    docs.push(
      path.call(
        print,
        "openParenthesisPunctuator" as keyof UnaryExpression[
          "openParenthesisPunctuator"
        ],
      ),
    );
  }

  docs.push(
    path.call(
      print,
      "operand",
    ),
  );

  if (unaryExpression.arrayElementAccess !== undefined) {
    docs.push(
      ...(
        path.call(
          print,
          "arrayElementAccess" as keyof UnaryExpression["arrayElementAccess"],
        ) as Doc[]
      ),
    );
  }

  if (unaryExpression.classMemberAccess !== undefined) {
    docs.push(
      ...(path.call(
        print,
        "classMemberAccess" as keyof UnaryExpression["classMemberAccess"],
      ) as Doc[]),
    );
  }

  if (unaryExpression.closeParenthesisPunctuator !== undefined) {
    docs.push(
      path.call(
        print,
        "closeParenthesisPunctuator" as keyof UnaryExpression[
          "closeParenthesisPunctuator"
        ],
      ),
    );
  }

  if (unaryExpression.postfixOperator !== undefined) {
    docs.push(
      path.call(
        print,
        "postfixOperator" as keyof UnaryExpression["postfixOperator"],
      ),
    );
  }

  return docs;
}

function printBinaryExpression(
  path: AstPath<BinaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc[] {
  const subDocs: Doc[] = [];

  subDocs.push([path.call(print, "leftOperand")]);
  addNonBreakingSeparator(subDocs);
  subDocs.push(
    path.call(print, "binaryOperator"),
  );

  const docs: Doc[] = [];

  docs.push(fill(subDocs));

  const rightDocs = path.call(print, "rightOperand");
  if (
    Array.isArray(rightDocs) && (rightDocs.length === 3) &&
    ((rightDocs[1] as IfBreak).type === "if-break")
  ) {
    addBreakingSeparator(subDocs);
    subDocs.push(rightDocs[0]);
    docs.push(rightDocs[1]);
    docs.push(rightDocs[2]);
  } else {
    addBreakingSeparator(docs);
    docs.push(rightDocs);
  }

  return docs;
}

function printLengthOfExpression(
  path: AstPath<LengthofExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc[] {
  const docs = [];

  docs.push(
    path.call(print, "lengthOfKeyword"),
  );
  docs.push(
    path.call(print, "openParenthesisPunctuator"),
  );
  docs.push(path.call(print, "operand"));
  docs.push(
    path.call(print, "closeParenthesisPunctuator"),
  );

  return docs;
}

export function printAbstractExpression(
  path: AstPath<AbstractExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc[] {
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
