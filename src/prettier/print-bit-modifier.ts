import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { BitModifier } from "../ast/node/bit-modifier.ts";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

export function printBitModifier(
  path: AstPath<BitModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const bitModifier = path.node;
  let doc: Doc = [];

  doc.push(path.call(print, "colonPunctuator"));
  addNonBreakingWhitespace(doc);

  const subDoc: Doc = [];

  subDoc.push(path.call(print, "bitKeyword"));
  subDoc.push(path.call(print, "openParenthesisPunctuator"));
  subDoc.push(path.call(print, "length"));
  subDoc.push(path.call(print, "closeParenthesisPunctuator"));
  doc.push(subDoc);
  addNonBreakingWhitespace(doc);

  if (bitModifier.identifier !== undefined) {
    doc.push(
      path.call(
        print,
        "identifier" as keyof BitModifier["identifier"],
      ),
    );
    addNonBreakingWhitespace(doc);
    doc.push(
      path.call(
        print,
        "assignmentOperator" as keyof BitModifier["assignmentOperator"],
      ),
    );
    doc = addBreakingWhitespace(doc);
  }

  doc.push(path.call(print, "classId"));

  return doc;
}
