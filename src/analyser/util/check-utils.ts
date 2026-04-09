import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { IfStatement } from "../../ast/node/if-statement.ts";
import type { SwitchStatement } from "../../ast/node/switch-statement.ts";
import { isCaseClause, isDefaultClause, isStatement } from "../../ast/util/types.ts";

export function collectMemberVariableNames(statement: AbstractStatement): Set<string> {
  const names = new Set<string>();

  function traverse(stmt: AbstractStatement) {
    if (stmt.nodeKind === NodeKind.STATEMENT) {
      switch (stmt.statementKind) {
        case StatementKind.ELEMENTARY_TYPE_DEFINITION:
        case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
        case StatementKind.ARRAY_DEFINITION:
        case StatementKind.COMPUTED_ARRAY_DEFINITION:
        case StatementKind.STRING_DEFINITION:
        case StatementKind.CLASS_DEFINITION:
        case StatementKind.MAP_DEFINITION: {
          const stmtWithIdentifier = stmt as { identifier?: { name?: string } };
          if (stmtWithIdentifier.identifier?.name) {
            names.add(stmtWithIdentifier.identifier.name);
          }
          break;
        }
        case StatementKind.COMPOUND: {
          const compoundStmt = stmt as { statements?: AbstractStatement[] };
          if (compoundStmt.statements) {
            for (const nestedStmt of compoundStmt.statements) {
              if (isStatement(nestedStmt)) {
                traverse(nestedStmt);
              }
            }
          }
          break;
        }
        case StatementKind.IF: {
          const ifStmt = stmt as IfStatement;
          if (isStatement(ifStmt.ifStatement)) {
            traverse(ifStmt.ifStatement);
          }
          if (isStatement(ifStmt.elseStatement)) {
            traverse(ifStmt.elseStatement);
          }
          break;
        }
        case StatementKind.SWITCH: {
          const switchStmt = stmt as SwitchStatement;
          if (switchStmt.caseClauses) {
            for (const caseClause of switchStmt.caseClauses) {
              if (isCaseClause(caseClause) && caseClause.statements) {
                for (const nestedStmt of caseClause.statements) {
                  if (isStatement(nestedStmt)) {
                    traverse(nestedStmt);
                  }
                }
              }
            }
          }
          if (isDefaultClause(switchStmt.defaultClause) && switchStmt.defaultClause.statements) {
            for (const nestedStmt of switchStmt.defaultClause.statements) {
              if (isStatement(nestedStmt)) {
                traverse(nestedStmt);
              }
            }
          }
          break;
        }
      }
    }
  }

  traverse(statement);
  return names;
}