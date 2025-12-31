import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ParameterList } from "../ast/node/parameter-list.ts";
import { interleaveCommaSeparatorDocs } from "./util/print-utils.ts";

export function printParameterList(
  path: AstPath<ParameterList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parametersDoc = interleaveCommaSeparatorDocs(
    path.map(print, "parameters"),
    path.map(print, "commaPunctuators"),
  );

  return [
    path.call(print, "openParenthesisPunctuator"),
    parametersDoc,
    path.call(print, "closeParenthesisPunctuator"),
  ];
}
