import { AstPath, type Doc } from "prettier";
import { addNonBreakingWhitespace } from "./util/print-utils.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ElementaryType } from "../ast/node/elementary-type.ts";

export function printElementaryType(
  path: AstPath<ElementaryType>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elementaryType = path.node;

  const doc: Doc = [];
  if (elementaryType.unsignedQualifierKeyword) {
    doc.push(
      path.call(
        print,
        "unsignedQualifierKeyword" as keyof ElementaryType[
          "unsignedQualifierKeyword"
        ],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  doc.push(path.call(print, "typeKeyword"));

  return doc;
}
