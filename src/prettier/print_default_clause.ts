import type { AstPath, Doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import { addIndentedBlock, addIndentedStatements } from "./print_utils.ts";
import type { DefaultClause } from "../ast/node/DefaultClause.ts";

export function printDefaultClause(
  path: AstPath<DefaultClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const defaultClause = path.node;
  const docs = [];

  docs.push([
    path.call(print, "defaultKeyword"),
    path.call(print, "colonPunctuator"),
  ]);

  const statementDocs = path.map(print, "statements");

  if (defaultClause.openBracePunctuator !== undefined) {
    docs.push(" ");
    addIndentedBlock(
      docs,
      statementDocs,
      defaultClause.openBracePunctuator,
      defaultClause.closeBracePunctuator!,
    );
  } else {
    addIndentedStatements(docs, statementDocs);
  }

  return docs;
}
