import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { BitModifier } from "../ast/node/BitModifier.ts";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print_utils.ts";

export function printBitModifier(
  path: AstPath<BitModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const bitModifier = path.node;
  const docs = [];

  docs.push(path.call(print, "colonPunctuator"));
  addNonBreakingSeparator(docs);

  const subDocs = [];

  subDocs.push(path.call(print, "bitKeyword"));
  subDocs.push(path.call(print, "openParenthesisPunctuator"));
  subDocs.push(path.call(print, "length"));
  subDocs.push(path.call(print, "closeParenthesisPunctuator"));
  docs.push(subDocs);
  addNonBreakingSeparator(docs);

  if (bitModifier.identifier !== undefined) {
    docs.push(
      path.call(
        print,
        "identifier" as keyof BitModifier["identifier"],
      ),
    );
    addNonBreakingSeparator(docs);
    docs.push(
      path.call(
        print,
        "assignmentOperator" as keyof BitModifier["assignmentOperator"],
      ),
    );
    addBreakingSeparator(docs);
  }

  docs.push(path.call(print, "classId"));

  return docs;
}
