import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { IfStatement } from "../../ast/node/if-statement.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { SymbolTable } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";
import {
  isCaseClause,
  isDefaultClause,
  isStatement,
} from "../../ast/util/types.ts";
import type { SwitchStatement } from "../../ast/node/switch-statement.ts";

export function collectMemberVariableNames(
  statement: AbstractStatement,
): Set<string> {
  const names = new Set<string>();

  function traverse(stmt: AbstractStatement) {
    // Check if this statement declares a member variable
    if (stmt.nodeKind === NodeKind.STATEMENT) {
      switch (stmt.statementKind) {
        case StatementKind.ELEMENTARY_TYPE_DEFINITION:
        case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
        case StatementKind.ARRAY_DEFINITION:
        case StatementKind.COMPUTED_ARRAY_DEFINITION:
        case StatementKind.STRING_DEFINITION:
        case StatementKind.CLASS_DEFINITION:
        case StatementKind.MAP_DEFINITION: {
          // These statements have an identifier property that represents the variable name
          const stmtWithIdentifier = stmt as { identifier?: { name?: string } };
          if (stmtWithIdentifier.identifier?.name) {
            names.add(stmtWithIdentifier.identifier.name);
          }
          break;
        }
        case StatementKind.COMPOUND: {
          // Recursively check compound statements
          const compoundStmt = stmt as { statements?: AbstractStatement[] };
          if (compoundStmt.statements) {
            for (const nestedStmt of compoundStmt.statements) {
              traverse(nestedStmt);
            }
          }
          break;
        }
        case StatementKind.IF: {
          // Recursively check if statements
          const ifStmt = stmt as IfStatement;

          if (!isStatement(ifStmt.ifStatement)) {
            break;
          }

          traverse(ifStmt.ifStatement);

          if (isStatement(ifStmt.elseStatement)) {
            traverse(ifStmt.elseStatement);
          }
          break;
        }
        case StatementKind.SWITCH: {
          // Recursively check switch statements
          const switchStmt = stmt as SwitchStatement;

          if (switchStmt.caseClauses) {
            for (const caseClause of switchStmt.caseClauses) {
              if (isCaseClause(caseClause) && caseClause.statements) {
                for (const nestedStmt of caseClause.statements) {
                  traverse(nestedStmt as AbstractStatement);
                }
              }
            }
          }
          if (
            isDefaultClause(switchStmt.defaultClause) &&
            switchStmt.defaultClause.statements
          ) {
            for (const nestedStmt of switchStmt.defaultClause.statements) {
              traverse(nestedStmt as AbstractStatement);
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

function collectAllBranchMemberNames(
  statement: AbstractStatement,
): Set<string> {
  const allNames = new Set<string>();

  function addBranchNames(stmt: AbstractStatement) {
    const names = collectMemberVariableNames(stmt);
    for (const name of names) {
      allNames.add(name);
    }

    // Recursively check nested if statements (else if chains)
    if (stmt.statementKind === StatementKind.IF) {
      const ifStmt = stmt as IfStatement;
      if (isStatement(ifStmt.elseStatement)) {
        addBranchNames(ifStmt.elseStatement);
      }
    }
  }

  addBranchNames(statement);

  return allNames;
}

export const checkIfStatement: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.IF,
  checkFunc: function (
    ifStatement: IfStatement,
    symbolTable: SymbolTable,
    _strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    const classScope = symbolTable.getEnclosingClassScope();
    if (!classScope) {
      return results;
    }

    if (!isStatement(ifStatement.ifStatement)) {
      return results;
    }

    const ifMemberNames = collectMemberVariableNames(ifStatement.ifStatement);

    // Handle else if chains by collecting all member names from the else branch
    let elseMemberNames = new Set<string>();
    if (isStatement(ifStatement.elseStatement)) {
      elseMemberNames = collectAllBranchMemberNames(ifStatement.elseStatement);
    }

    const overlappingNames: string[] = [];
    for (const name of ifMemberNames) {
      if (elseMemberNames.has(name)) {
        overlappingNames.push(name);
      }
    }

    if (overlappingNames.length > 0) {
      results.push({
        message:
          "This if-then-else clauses may result in duplicate class member variables being declared simultaneously.",
        location: ifStatement.startToken!.getLocation(),
        isWarning: true,
      });
    }

    return results;
  },
};
