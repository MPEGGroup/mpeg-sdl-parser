import type { AstPath, Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ParameterList } from "../ast/node/ParameterList.ts";
import { addCommaSeparatorsToDoc } from "./print_utils.ts";

export function printParameterList(
  path: AstPath<ParameterList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterList = path.node;

  const parameterDocs = addCommaSeparatorsToDoc(
    path.map(print, "parameters"),
    parameterList.commaPunctuators,
  );

  return [
    path.call(print, "openParenthesisPunctuator"),
    parameterDocs,
    path.call(print, "closeParenthesisPunctuator"),
  ];
}
