import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { ParameterValueList } from "../ast/node/parameter-value-list.ts";
import { interleaveCommaSeparatorDocs } from "./util/print-utils.ts";

export function printParameterValueList(
  path: AstPath<ParameterValueList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterValuesDoc = interleaveCommaSeparatorDocs(
    path.map(print, "values"),
    path.map(print, "commaPunctuators"),
  );

  return [
    path.call(print, "openParenthesisPunctuator"),
    parameterValuesDoc,
    path.call(print, "closeParenthesisPunctuator"),
  ];
}
