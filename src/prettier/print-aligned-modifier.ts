import type { AstPath, Doc } from "prettier";
import type { AlignedModifier } from "../ast/node/aligned-modifier.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";

export function printAlignedModifier(
  path: AstPath<AlignedModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const alignedModifier = path.node;

  const doc: Doc = [];

  const d = path.call(print, "alignedKeyword");
  doc.push(d);

  if (alignedModifier.openParenthesisPunctuator) {
    doc.push(
      path.call(
        print,
        "openParenthesisPunctuator" as keyof AlignedModifier[
          "openParenthesisPunctuator"
        ],
      ),
    );
  }

  if (alignedModifier.bitCountModifierToken) {
    doc.push(
      path.call(
        print,
        "bitCountModifierToken" as keyof AlignedModifier[
          "bitCountModifierToken"
        ],
      ),
    );
  }

  if (alignedModifier.closeParenthesisPunctuator) {
    doc.push(
      path.call(
        print,
        "closeParenthesisPunctuator" as keyof AlignedModifier[
          "closeParenthesisPunctuator"
        ],
      ),
    );
  }

  return doc;
}
