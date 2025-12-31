import { AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { AbstractStatement } from "../ast/node/abstract-statement.ts";
import { NodeKind } from "../ast/node/enum/node-kind.ts";
import { StatementKind } from "../ast/node/enum/statement-kind.ts";
import type { Specification } from "../ast/node/specification.ts";
import {
  addTrailingHardline,
  endsWithHardline,
  removeLeadingBlanklines,
} from "./util/print-utils.ts";

const { hardline } = doc.builders;

export function printSpecification(
  path: AstPath<Specification>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const doc: Doc = [];
  const node = path.node;
  let previousStatementKind: StatementKind | undefined;

  for (let i = 0; i < node.children.length; i++) {
    const globalNode = node.children[i];

    if (globalNode.nodeKind === NodeKind.STATEMENT) {
      const statementKind = (globalNode as AbstractStatement).statementKind;
      if (
        (i > 0) &&
        (previousStatementKind !== undefined) &&
        ((statementKind !== previousStatementKind) ||
          (statementKind !== StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION))
      ) {
        doc.push(hardline);
      }
      previousStatementKind = statementKind;
    }

    let globalDoc = path.call(print, "children", i);

    globalDoc = removeLeadingBlanklines(globalDoc);

    if (!endsWithHardline(globalDoc)) {
      globalDoc = addTrailingHardline(globalDoc);
    }

    doc.push(globalDoc);
  }

  return doc;
}
