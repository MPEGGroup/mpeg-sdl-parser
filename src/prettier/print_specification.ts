import { AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { AbstractStatement } from "../ast/node/AbstractStatement.ts";
import { NodeKind } from "../ast/node/enum/node_kind.ts";
import { StatementKind } from "../ast/node/enum/statement_kind.ts";
import type { Specification } from "../ast/node/Specification.ts";
const { hardline, join } = doc.builders;

export function printSpecification(
  path: AstPath<Specification>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const node = path.node;

  const globalElements = path.map(print, "globals");

  const elements: Doc[] = [];

  let previousStatementKind: StatementKind | undefined;

  for (let i = 0; i < globalElements.length; i++) {
    const globalElement = globalElements[i];
    const globalNode = node.globals[i];
    if (globalNode.nodeKind === NodeKind.STATEMENT) {
      const statementKind = (globalNode as AbstractStatement).statementKind;
      if (
        (previousStatementKind !== undefined) &&
        ((statementKind !==
          StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION) ||
          (statementKind !== previousStatementKind))
      ) {
        elements.push([
          hardline,
          globalElement,
        ]);
      } else {
        elements.push(globalElement);
      }
      previousStatementKind = statementKind;
    } else {
      elements.push(globalElement);
    }
  }

  return [
    join(
      hardline,
      elements,
    ),
  ];
}
