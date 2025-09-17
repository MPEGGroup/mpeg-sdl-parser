import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import {
  getChildNodesAndTokens,
  isAbstractNode,
} from "../../util/nodeFactoryUtils.ts";
import { Specification } from "../node/Specification.ts";
import type { ComputedElementaryTypeDefinition } from "../node/ComputedElementaryTypeDefinition.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { AbstractStatement } from "../node/AbstractStatement.ts";
import { StatementKind } from "../node/enum/statement_kind.ts";
import type { MapDeclaration } from "../node/MapDeclaration.ts";
import type { ClassDeclaration } from "../node/ClassDeclaration.ts";

export function getSpecification(
  cursor: TreeCursor,
  text: Text,
): Specification {
  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);

  const globals:
    (ComputedElementaryTypeDefinition | MapDeclaration | ClassDeclaration)[] =
      [];
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      if (childNodeOrToken.nodeKind !== NodeKind.STATEMENT) {
        throw new InternalParseError(
          `Expected node kind to be STATEMENT, got: ${
            NodeKind[childNodeOrToken.nodeKind]
          }`,
        );
      }
      const statement = childNodeOrToken as AbstractStatement;
      switch (statement.statementKind) {
        case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
          globals.push(statement as ComputedElementaryTypeDefinition);
          break;
        case StatementKind.MAP_DECLARATION:
          globals.push(statement as MapDeclaration);
          break;
        case StatementKind.CLASS_DECLARATION:
          globals.push(statement as ClassDeclaration);
          break;
        default:
          throw new InternalParseError(
            `Unexpected statement kind: ${
              StatementKind[statement.statementKind]
            }`,
          );
      }
    } else {
      throw new InternalParseError(
        `Expected child to be an AbstractNode, got Token: ${childNodeOrToken.text}`,
      );
    }
  }

  return new Specification(globals);
}
