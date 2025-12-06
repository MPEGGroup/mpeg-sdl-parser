import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ComputedElementaryTypeDefinition } from "../ast/node/computed-elementary-type-definition.ts";
import {
  addBreakingSeparator,
  addNonBreakingSeparator,
} from "./util/print-utils.ts";

const { fill } = doc.builders;

export function printComputedElementaryTypeDefinition(
  path: AstPath<ComputedElementaryTypeDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const computedElementaryTypeDefinition = path.node;

  const docs = [];

  docs.push(path.call(print, "computedKeyword"));
  addBreakingSeparator(docs);

  if (computedElementaryTypeDefinition.constKeyword) {
    docs.push(
      path.call(
        print,
        "constKeyword" as keyof ComputedElementaryTypeDefinition[
          "constKeyword"
        ],
      ),
    );
    addBreakingSeparator(docs);
  }

  docs.push(path.call(print, "elementaryType"));
  addBreakingSeparator(docs);

  docs.push(path.call(print, "identifier"));

  if (computedElementaryTypeDefinition.value !== undefined) {
    addNonBreakingSeparator(docs);
    docs.push(
      path.call(
        print,
        "assignmentOperator" as keyof ComputedElementaryTypeDefinition[
          "assignmentOperator"
        ],
      ),
    );
    addBreakingSeparator(docs);
    docs.push(
      path.call(
        print,
        "value" as keyof ComputedElementaryTypeDefinition["value"],
      ),
    );
  }

  docs.push(path.call(print, "semicolonPunctuator"));

  return fill(docs);
}
