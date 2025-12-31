import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ElementaryTypeDefinition } from "../ast/node/elementary-type-definition.ts";
import {
  addBreakingWhitespace,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";

const { fill } = doc.builders;

export function printElementaryTypeDefinition(
  path: AstPath<ElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elementaryTypeDefinition = path.node;
  let doc: Doc = [];

  if (elementaryTypeDefinition.reservedKeyword) {
    doc.push(
      path.call(
        print,
        "reservedKeyword" as keyof ElementaryTypeDefinition["reservedKeyword"],
      ),
    );
    doc = addBreakingWhitespace(doc);
  }

  if (elementaryTypeDefinition.legacyKeyword) {
    doc.push(
      path.call(
        print,
        "legacyKeyword" as keyof ElementaryTypeDefinition["legacyKeyword"],
      ),
    );
    doc = addBreakingWhitespace(doc);
  }

  if (elementaryTypeDefinition.constKeyword) {
    doc.push(
      path.call(
        print,
        "constKeyword" as keyof ElementaryTypeDefinition["constKeyword"],
      ),
    );
    doc = addBreakingWhitespace(doc);
  }

  if (elementaryTypeDefinition.alignedModifier !== undefined) {
    doc.push(
      path.call(
        print,
        "alignedModifier" as keyof ElementaryTypeDefinition["alignedModifier"],
      ),
    );
    doc = addBreakingWhitespace(doc);
  }

  doc.push(path.call(print, "elementaryType"));
  doc.push(path.call(print, "lengthAttribute"));

  if (elementaryTypeDefinition.lookAheadOperator) {
    doc.push(
      path.call(
        print,
        "lookAheadOperator" as keyof ElementaryTypeDefinition[
          "lookAheadOperator"
        ],
      ),
    );
  }
  doc = addBreakingWhitespace(doc);

  doc.push(path.call(print, "identifier"));

  if (elementaryTypeDefinition.assignmentOperator !== undefined) {
    addNonBreakingWhitespace(doc);
    doc.push(
      path.call(
        print,
        "assignmentOperator" as keyof ElementaryTypeDefinition[
          "assignmentOperator"
        ],
      ),
    );
    doc = addBreakingWhitespace(doc);
    doc.push(
      path.call(print, "value" as keyof ElementaryTypeDefinition["value"]),
    );
    if (elementaryTypeDefinition.endValue !== undefined) {
      doc.push(
        path.call(
          print,
          "rangeOperator" as keyof ElementaryTypeDefinition["rangeOperator"],
        ),
      );
      doc.push(
        path.call(
          print,
          "endValue" as keyof ElementaryTypeDefinition["endValue"],
        ),
      );
    }
  }

  doc.push(path.call(print, "semicolonPunctuator"));

  return fill(doc);
}
