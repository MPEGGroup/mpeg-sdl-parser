import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { SwitchStatement } from "../../ast/node/switch-statement.ts";
import type { CaseClause } from "../../ast/node/case-clause.ts";
import type { DefaultClause } from "../../ast/node/default-clause.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { SymbolTable } from "../symbol-table.ts";
import type { Check, CheckResult } from "./check.ts";
import {
  isCaseClause,
  isDefaultClause,
  isStatement,
} from "../../ast/util/types.ts";
import { collectMemberVariableNames } from "./check-if-statement.ts";

function collectMemberVariableNamesFromCaseClause(
  caseClause: CaseClause,
): Set<string> {
  const names = new Set<string>();

  for (const stmt of caseClause.statements) {
    const stmtNames = collectMemberVariableNames(stmt as AbstractStatement);
    for (const name of stmtNames) {
      names.add(name);
    }
  }

  return names;
}

function collectMemberVariableNamesFromDefaultClause(
  defaultClause: DefaultClause,
): Set<string> {
  const names = new Set<string>();

  for (const stmt of defaultClause.statements) {
    if (isStatement(stmt)) {
      const stmtNames = collectMemberVariableNames(stmt);
      for (const name of stmtNames) {
        names.add(name);
      }
    }
  }

  return names;
}

function checkPossibleDuplicateMembers(
  switchStatement: SwitchStatement,
): CheckResult[] {
  const results: CheckResult[] = [];

  // Collect member variable names from all case clauses and default clause
  const allMemberNamesByClause: Array<
    { names: Set<string>; clause: CaseClause | DefaultClause }
  > = [];

  // Process case clauses
  for (const caseClause of switchStatement.caseClauses) {
    if (isCaseClause(caseClause)) {
      const names = collectMemberVariableNamesFromCaseClause(caseClause);

      if (names.size > 0) {
        allMemberNamesByClause.push({ names, clause: caseClause });
      }
    }
  }

  // Process default clause
  if (isDefaultClause(switchStatement.defaultClause)) {
    const names = collectMemberVariableNamesFromDefaultClause(
      switchStatement.defaultClause,
    );

    if (names.size > 0) {
      allMemberNamesByClause.push({
        names,
        clause: switchStatement.defaultClause,
      });
    }
  }

  // Check for overlapping names between clauses
  const foundOverlaps = new Set<string>();

  for (let i = 0; i < allMemberNamesByClause.length; i++) {
    for (let j = i + 1; j < allMemberNamesByClause.length; j++) {
      const names1 = allMemberNamesByClause[i].names;
      const names2 = allMemberNamesByClause[j].names;

      for (const name of names1) {
        if (names2.has(name)) {
          foundOverlaps.add(name);
        }
      }
    }
  }

  if (foundOverlaps.size > 0) {
    results.push({
      message:
        "This switch statement may result in duplicate class member variables being declared simultaneously.",
      location: switchStatement.startToken!.getLocation(),
      isWarning: true,
    });
  }

  return results;
}

function checkDefiniteDuplicateMembers(
  switchStatement: SwitchStatement,
): CheckResult[] {
  const results: CheckResult[] = [];

  // Collect member variable names from all case clauses
  const allCaseMemberNames: Array<Set<string>> = [];

  for (const caseClause of switchStatement.caseClauses) {
    if (isCaseClause(caseClause)) {
      const names = collectMemberVariableNamesFromCaseClause(caseClause);

      if (names.size > 0) {
        allCaseMemberNames.push(names);
      }
    }
  }

  // Collect from default clause
  let defaultMemberNames = new Set<string>();

  if (isDefaultClause(switchStatement.defaultClause)) {
    defaultMemberNames = collectMemberVariableNamesFromDefaultClause(
      switchStatement.defaultClause,
    );
  }

  // If we have at least 2 clauses with variables
  if (allCaseMemberNames.length >= 2) {
    // Find variables that appear in ALL case clauses
    const firstCaseNames = allCaseMemberNames[0];
    const definiteOverlaps = new Set<string>();

    for (const name of firstCaseNames) {
      let appearsInAll = true;

      // Check if it appears in all other case clauses
      for (let i = 1; i < allCaseMemberNames.length; i++) {
        if (!allCaseMemberNames[i].has(name)) {
          appearsInAll = false;
          break;
        }
      }

      // If there's a default clause, it must also have the variable
      if (
        appearsInAll && isDefaultClause(switchStatement.defaultClause) &&
        defaultMemberNames.size > 0
      ) {
        if (!defaultMemberNames.has(name)) {
          appearsInAll = false;
        }
      }

      if (appearsInAll) {
        definiteOverlaps.add(name);
      }
    }

    if (definiteOverlaps.size > 0) {
      results.push({
        message:
          "This switch statement will result in duplicate class member variables being declared simultaneously.",
        location: switchStatement.startToken!.getLocation()!,
      });
    }
  }

  return results;
}

export const checkSwitchStatement: Check = {
  nodeKind: NodeKind.STATEMENT,
  subKind: StatementKind.SWITCH,
  checkFunc: function (
    switchStatement: SwitchStatement,
    symbolTable: SymbolTable,
    _strict: boolean,
  ): CheckResult[] {
    const results: CheckResult[] = [];

    // Check if we're in a class scope
    const classScope = symbolTable.getEnclosingClassScope();
    if (!classScope) {
      return results; // Not in a class scope, no need to check
    }

    // Check for possible duplicate members (warning)
    results.push(...checkPossibleDuplicateMembers(switchStatement));

    // Check for definite duplicate members (error)
    results.push(...checkDefiniteDuplicateMembers(switchStatement));

    return results;
  },
};
