import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ElementaryTypeDefinition } from "../ast/node/elementary-type-definition.ts";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./print-utils.ts";

const { fill } = doc.builders;

export function printElementaryTypeDefinition(
  path: AstPath<ElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const elementaryTypeDefinition = path.node;

  const docs = [];

  if (elementaryTypeDefinition.reservedKeyword) {
    docs.push(
      path.call(
        print,
        "reservedKeyword" as keyof ElementaryTypeDefinition["reservedKeyword"],
      ),
    );
    addBreakingSeparator(docs);
  }

  if (elementaryTypeDefinition.legacyKeyword) {
    docs.push(
      path.call(
        print,
        "legacyKeyword" as keyof ElementaryTypeDefinition["legacyKeyword"],
      ),
    );
    addBreakingSeparator(docs);
  }

  if (elementaryTypeDefinition.constKeyword) {
    docs.push(
      path.call(
        print,
        "constKeyword" as keyof ElementaryTypeDefinition["constKeyword"],
      ),
    );
    addBreakingSeparator(docs);
  }

  if (elementaryTypeDefinition.alignedModifier !== undefined) {
    docs.push(
      path.call(
        print,
        "alignedModifier" as keyof ElementaryTypeDefinition["alignedModifier"],
      ),
    );
    addBreakingSeparator(docs);
  }

  docs.push(path.call(print, "elementaryType"));
  docs.push(path.call(print, "lengthAttribute"));

  if (elementaryTypeDefinition.lookAheadOperator) {
    docs.push(
      path.call(
        print,
        "lookAheadOperator" as keyof ElementaryTypeDefinition[
          "lookAheadOperator"
        ],
      ),
    );
  }
  addBreakingSeparator(docs);

  docs.push(path.call(print, "identifier"));

  if (elementaryTypeDefinition.assignmentOperator !== undefined) {
    addNonBreakingSeparator(docs);
    docs.push(
      path.call(
        print,
        "assignmentOperator" as keyof ElementaryTypeDefinition[
          "assignmentOperator"
        ],
      ),
    );
    addBreakingSeparator(docs);
    docs.push(
      path.call(print, "value" as keyof ElementaryTypeDefinition["value"]),
    );
    if (elementaryTypeDefinition.endValue !== undefined) {
      docs.push(
        path.call(
          print,
          "rangeOperator" as keyof ElementaryTypeDefinition["rangeOperator"],
        ),
      );
      docs.push(
        path.call(
          print,
          "endValue" as keyof ElementaryTypeDefinition["endValue"],
        ),
      );
    }
  }

  docs.push(path.call(print, "semicolonPunctuator"));

  return fill(docs);
}
