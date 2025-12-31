import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ExpandableModifier } from "../ast/node/expandable-modifier.ts";

export function printExpandableModifier(
  path: AstPath<ExpandableModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const expandableModifier = path.node;

  const doc: Doc = [];

  doc.push(
    path.call(print, "expandableKeyword"),
  );

  if (expandableModifier.maxClassSize !== undefined) {
    doc.push(
      [
        path.call(
          print,
          "openParenthesisPunctuator" as keyof ExpandableModifier[
            "openParenthesisPunctuator"
          ],
        ),
        path.call(
          print,
          "maxClassSize" as keyof ExpandableModifier["maxClassSize"],
        ),
        path.call(
          print,
          "closeParenthesisPunctuator" as keyof ExpandableModifier[
            "closeParenthesisPunctuator"
          ],
        ),
      ],
    );
  }

  return doc;
}
