import type { AstPath, Doc } from "prettier";
import type { AbstractClassId } from "../ast/node/AbstractClassId.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ClassId } from "../ast/node/ClassId.ts";
import type { ClassIdRange } from "../ast/node/ClassIdRange.ts";
import { ClassIdKind } from "../ast/node/enum/class_id_kind.ts";
import type { ExtendedClassIdRange } from "../ast/node/ExtendedClassIdRange.ts";
import { addCommaSeparatorsToDoc } from "./print_utils.ts";

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
      const extendedClassIdRange = path.node as ExtendedClassIdRange;
      const docs = [];
      const outputValuesDoc = (path as AstPath<ExtendedClassIdRange>).map(
        print,
        "classIds",
      );

      docs.push(
        addCommaSeparatorsToDoc(
          outputValuesDoc,
          extendedClassIdRange.commaPunctuators,
        ),
      );

      return docs;
    }
    default: {
      const exhaustiveCheck: never = classIdKind;
      throw new Error(
        "Unreachable code reached, classIdKind == " + exhaustiveCheck,
      );
    }
  }
}
