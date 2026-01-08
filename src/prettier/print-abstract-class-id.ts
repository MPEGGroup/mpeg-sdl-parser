import type { AstPath, Doc } from "prettier";
import type { AbstractClassId } from "../ast/node/abstract-class-id.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ClassId } from "../ast/node/class-id.ts";
import type { ClassIdRange } from "../ast/node/class-id-range.ts";
import { ClassIdKind } from "../ast/node/enum/class-id-kind.ts";
import type { ExtendedClassIdRange } from "../ast/node/extended-class-id-range.ts";
import { interleaveCommaSeparatorDocs } from "./util/print-utils.ts";
import { InternalParseError } from "../parse-error.ts";

export function printAbstractClassId(
  path: AstPath<AbstractClassId>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { classIdKind } = path.node;

  switch (classIdKind) {
    case ClassIdKind.SINGLE:
      return (path as AstPath<ClassId>).call(print, "value");
    case ClassIdKind.RANGE: {
      return [
        (path as AstPath<ClassIdRange>).call(print, "startClassId"),
        (path as AstPath<ClassIdRange>).call(print, "rangeOperator"),
        (path as AstPath<ClassIdRange>).call(print, "endClassId"),
      ];
    }
    case ClassIdKind.EXTENDED_RANGE: {
      const doc: Doc = [];
      const outputValuesDoc = (path as AstPath<ExtendedClassIdRange>).map(
        print,
        "classIds",
      );

      doc.push(
        interleaveCommaSeparatorDocs(
          outputValuesDoc,
          (path as AstPath<ExtendedClassIdRange>).map(
            print,
            "commaPunctuators",
          ),
        ),
      );

      return doc;
    }
    default: {
      const exhaustiveCheck: never = classIdKind;
      throw new InternalParseError(
        "Unreachable code reached, classIdKind == " + exhaustiveCheck,
      );
    }
  }
}
