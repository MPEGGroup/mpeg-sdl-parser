import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ExtendsModifier } from "../ast/node/extends-modifier.ts";
import { addNonBreakingWhitespace } from "./util/print-utils.ts";

export function printExtendsModifier(
  path: AstPath<ExtendsModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapEntryList = path.node;

  const doc: Doc = [];

  doc.push(path.call(print, "extendsKeyword"));
  addNonBreakingWhitespace(doc);

  doc.push(path.call(print, "identifier"));

  if (mapEntryList.parameterValueList !== undefined) {
    doc.push(
      path.call(
        print,
        "parameterValueList" as keyof ExtendsModifier["parameterValueList"],
      ),
    );
  }

  return doc;
}
