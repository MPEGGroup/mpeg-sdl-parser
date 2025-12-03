import { AstPath, type Doc } from "prettier";
import { addNonBreakingSeparator } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ElementaryType } from "../ast/node/ElementaryType.ts";

export function printElementaryType(
  path: AstPath<ElementaryType>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elementaryType = path.node;

  const docs = [];
  if (elementaryType.unsignedQualifierKeyword) {
    docs.push(
      path.call(
        print,
        "unsignedQualifierKeyword" as keyof ElementaryType[
          "unsignedQualifierKeyword"
        ],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  docs.push(path.call(print, "typeKeyword"));

  return docs;
}
