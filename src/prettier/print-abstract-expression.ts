import { AstPath, type Doc, doc } from "prettier";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { AbstractExpression } from "../ast/node/abstract-expression.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import { ExpressionKind } from "../ast/node/enum/expression-kind.ts";
import type { LengthofExpression } from "../ast/node/length-of-expression.ts";
import type { BinaryExpression } from "../ast/node/binary-expression.ts";
import type { UnaryExpression } from "../ast/node/unary-expression.ts";

const { fill } = doc.builders;
type IfBreak = doc.builders.IfBreak;

function printUnaryExpression(
  path: AstPath<UnaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const unaryExpression = path.node;

  const doc: Doc = [];

  if (unaryExpression.unaryOperator !== undefined) {
    doc.push(
      path.call(
        print,
        "unaryOperator" as keyof UnaryExpression["unaryOperator"],
      ),
    );
  }

  if (unaryExpression.openParenthesisPunctuator !== undefined) {
    doc.push(
      path.call(
        print,
        "openParenthesisPunctuator" as keyof UnaryExpression[
          "openParenthesisPunctuator"
        ],
      ),
    );
  }

  doc.push(
    path.call(
      print,
      "operand",
    ),
  );

  if (unaryExpression.arrayElementAccess !== undefined) {
    doc.push(
      ...(
        path.call(
          print,
          "arrayElementAccess" as keyof UnaryExpression["arrayElementAccess"],
        ) as Doc[]
      ),
    );
  }

  if (unaryExpression.classMemberAccess !== undefined) {
    doc.push(
      ...(path.call(
        print,
        "classMemberAccess" as keyof UnaryExpression["classMemberAccess"],
      ) as Doc[]),
    );
  }

  if (unaryExpression.closeParenthesisPunctuator !== undefined) {
    doc.push(
      path.call(
        print,
        "closeParenthesisPunctuator" as keyof UnaryExpression[
          "closeParenthesisPunctuator"
        ],
      ),
    );
  }

  if (unaryExpression.postfixOperator !== undefined) {
    doc.push(
      path.call(
        print,
        "postfixOperator" as keyof UnaryExpression["postfixOperator"],
      ),
    );
  }

  return doc;
}

function printBinaryExpression(
  path: AstPath<BinaryExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  let subDoc: Doc = [];

  subDoc.push(path.call(print, "leftOperand"));
  addNonBreakingWhitespace(subDoc);
  subDoc.push(path.call(print, "binaryOperator"));

  let doc: Doc = [];

  doc.push(fill(subDoc));

  const rightDoc = path.call(print, "rightOperand");
  if (
    Array.isArray(rightDoc) && (rightDoc.length === 3) &&
    ((rightDoc[1] as IfBreak).type === "if-break")
  ) {
    subDoc = addBreakingWhitespace(subDoc);
    subDoc.push(rightDoc[0]);
    doc.push(rightDoc[1]);
    doc.push(rightDoc[2]);
  } else {
    doc = addBreakingWhitespace(doc);
    doc.push(rightDoc);
  }

  return doc;
}

function printLengthOfExpression(
  path: AstPath<LengthofExpression>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const doc: Doc = [];

  doc.push(
    path.call(print, "lengthOfKeyword"),
  );
  doc.push(
    path.call(print, "openParenthesisPunctuator"),
  );
  doc.push(path.call(print, "operand"));
  doc.push(
    path.call(print, "closeParenthesisPunctuator"),
  );

  return doc;
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
      throw new InternalParseError(
        "Unreachable code reached, expressionKind == " + exhaustiveCheck,
      );
    }
  }
}
