import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ParameterValueList } from "../ast/node/ParameterValueList.ts";
import { addCommaSeparatorsToDoc } from "./print_utils.ts";

export function printParameterValueList(
  path: AstPath<ParameterValueList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterValueList = path.node;

  const parameterValueDocs = addCommaSeparatorsToDoc(
    path.map(print, "values"),
    parameterValueList.commaPunctuators,
  );

  return [
    path.call(print, "openParenthesisPunctuator"),
    parameterValueDocs,
    path.call(print, "closeParenthesisPunctuator"),
  ];
}
