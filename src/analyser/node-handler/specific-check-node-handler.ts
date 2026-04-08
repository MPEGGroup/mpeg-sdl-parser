import type { SymbolTable } from "../symbol-table.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import type { Check } from "../checks/check.ts";
import { SemanticError, SemanticWarning } from "../../scanner-error.ts";

export class SpecificCheckNodeHandler extends AbstractAnalysisNodeHandler {
  constructor(public readonly symbolTable: SymbolTable, strict: boolean, private readonly checks: Check[]) {
    super(symbolTable, strict);

    this.checks.forEach((check) => {
        this.registerBeforeNodeHandler(
          check.nodeKind,
          check.subKind,
          (node) => {
            const checkResults = check.checkFunc(node, symbolTable, strict);

            for (const checkResult of checkResults) {

              if (checkResult.isWarning) {
                const warning = new SemanticWarning(
                  checkResult.message,
                  checkResult.location,
                );
          
                this.semanticWarnings.push(warning);
              }
              else {
                const error = new SemanticError(
                  checkResult.message,
                  checkResult.location,
                );
          
                if (this.strict) {
                  throw error;
                }

                this.semanticErrors.push(error);
              }
            }
          }
        )
    });
  }
}
