import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ComputedElementaryTypeDefinition } from "../ast/node/computed-elementary-type-definition.ts";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

const { fill } = doc.builders;

export function printComputedElementaryTypeDefinition(
  path: AstPath<ComputedElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const computedElementaryTypeDefinition = path.node;
  let doc: Doc = [];

  doc.push(path.call(print, "computedKeyword"));
  doc = addBreakingWhitespace(doc);

  if (computedElementaryTypeDefinition.constKeyword) {
    doc.push(
      path.call(
        print,
        "constKeyword" as keyof ComputedElementaryTypeDefinition[
          "constKeyword"
        ],
      ),
    );
    doc = addBreakingWhitespace(doc);
  }

  doc.push(path.call(print, "elementaryType"));
  doc = addBreakingWhitespace(doc);

  doc.push(path.call(print, "identifier"));

  if (computedElementaryTypeDefinition.value !== undefined) {
    addNonBreakingWhitespace(doc);
    doc.push(
      path.call(
        print,
        "assignmentOperator" as keyof ComputedElementaryTypeDefinition[
          "assignmentOperator"
        ],
      ),
    );
    doc = addBreakingWhitespace(doc);
    doc.push(
      path.call(
        print,
        "value" as keyof ComputedElementaryTypeDefinition["value"],
      ),
    );
  }

  doc.push(path.call(print, "semicolonPunctuator"));

  return fill(doc);
}
