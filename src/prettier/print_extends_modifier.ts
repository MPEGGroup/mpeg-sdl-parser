import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ExtendsModifier } from "../ast/node/ExtendsModifier.ts";
import { addNonBreakingSeparator } from "./print_utils.ts";

export function printExtendsModifier(
  path: AstPath<ExtendsModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapEntryList = path.node;

  const docs: Doc[] = [];

  docs.push(path.call(print, "extendsKeyword"));
  addNonBreakingSeparator(docs);

  docs.push(path.call(print, "identifier"));

  if (mapEntryList.parameterValueList !== undefined) {
    docs.push(
      path.call(
        print,
        "parameterValueList" as keyof ExtendsModifier["parameterValueList"],
      ),
    );
  }

  return docs;
}
