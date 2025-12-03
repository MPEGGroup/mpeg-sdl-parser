import type { AstPath, Doc } from "prettier";
import type { AlignedModifier } from "../ast/node/AlignedModifier.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";

export function printAlignedModifier(
  path: AstPath<AlignedModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const alignedModifier = path.node;

  const docs: Doc[] = [];

  const d = path.call(print, "alignedKeyword");
  docs.push(d);

  if (alignedModifier.openParenthesisPunctuator) {
    docs.push(
      path.call(
        print,
        "openParenthesisPunctuator" as keyof AlignedModifier[
          "openParenthesisPunctuator"
        ],
      ),
    );
  }

  if (alignedModifier.bitCountModifierToken) {
    docs.push(
      path.call(
        print,
        "bitCountModifierToken" as keyof AlignedModifier[
          "bitCountModifierToken"
        ],
      ),
    );
  }

  if (alignedModifier.closeParenthesisPunctuator) {
    docs.push(
      path.call(
        print,
        "closeParenthesisPunctuator" as keyof AlignedModifier[
          "closeParenthesisPunctuator"
        ],
      ),
    );
  }

  return docs;
}
