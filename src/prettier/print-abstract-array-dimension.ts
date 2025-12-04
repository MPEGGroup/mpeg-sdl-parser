import type { AstPath, Doc } from "prettier";
import type { AbstractArrayDimension } from "../ast/node/abstract-array-dimension.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import { ArrayDimensionKind } from "../ast/node/enum/array-dimension-kind.ts";
import type { ExplicitArrayDimension } from "../ast/node/explicit-array-dimension.ts";
import type { ImplicitArrayDimension } from "../ast/node/implicit-array-dimension.ts";
import type { PartialArrayDimension } from "../ast/node/partial-array-dimension.ts";

export function printAbstractArrayDimension(
  path: AstPath<AbstractArrayDimension>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { arrayDimensionKind } = path.node;

  switch (arrayDimensionKind) {
    case ArrayDimensionKind.EXPLICIT: {
      return [
        path.call(print, "openBracketPunctuator"),
        (path as AstPath<ExplicitArrayDimension>).call(print, "size"),
        path.call(print, "closeBracketPunctuator"),
      ];
    }
    case ArrayDimensionKind.PARTIAL: {
      return [
        path.call(print, "openBracketPunctuator"),
        path.call(print, "openBracketPunctuator"),
        (path as AstPath<PartialArrayDimension>).call(
          print,
          "innerOpenBracketPunctuator",
        ),
        (path as AstPath<PartialArrayDimension>).call(print, "index"),
        (path as AstPath<PartialArrayDimension>).call(
          print,
          "innerCloseBracketPunctuator",
        ),
        path.call(print, "closeBracketPunctuator"),
      ];
    }
    case ArrayDimensionKind.IMPLICIT: {
      const node = path.node as ImplicitArrayDimension;
      const docs = [];

      docs.push(
        path.call(print, "openBracketPunctuator"),
      );
      docs.push("[");

      if (node.rangeStart !== undefined) {
        docs.push(
          path.call(
            print,
            "rangeStart" as keyof ImplicitArrayDimension["rangeStart"],
          ),
        );
      }

      if (node.rangeOperator !== undefined) {
        docs.push(
          path.call(
            print,
            "rangeOperator" as keyof ImplicitArrayDimension["rangeOperator"],
          ),
        );
        docs.push(
          path.call(
            print,
            "rangeEnd" as keyof ImplicitArrayDimension["rangeEnd"],
          ),
        );
      }

      docs.push(
        path.call(print, "closeBracketPunctuator"),
      );
      return docs;
    }

    default: {
      const exhaustiveCheck: never = arrayDimensionKind;
      throw new Error(
        "Unreachable code reached, arrayDimensionKind == " + exhaustiveCheck,
      );
    }
  }
}
