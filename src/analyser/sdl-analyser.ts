import type { Specification } from "../ast/node/specification.ts";
import { dispatchNodeHandler } from "../parse-helper.ts";
import type { SemanticError, SemanticWarning } from "../scanner-error.ts";
import { BuildSymbolTableNodeHandler } from "./node-handler/build-symbol-table-node-handler.ts";
import type { Check } from "./checks/check.ts";
import { ValidateScopeNodeHandler } from "./node-handler/validate-scope-node-handler.ts";
import { ValidateTypeNodeHandler } from "./node-handler/validate-type-node-handler.ts";
import { SymbolTable } from "./symbol-table.ts";
import { SpecificCheckNodeHandler } from "./node-handler/specific-check-node-handler.ts";

export interface SdlAnalysisResult {
  semanticErrors: Array<SemanticError>;
  semanticWarnings: Array<SemanticWarning>;
  specification: Specification;
  symbolTable: SymbolTable;
}

export class SdlAnalyser {
  strict: boolean = false;
  checks: Check[] = [];

  configure(options: { checks?: Check[]; strict?: boolean }): SdlAnalyser {
    if (options.checks) {
      this.checks = options.checks;
    }

    if (options.strict !== undefined) {
      this.strict = options.strict;
    }

    return this;
  }

  analyse(specification: Specification): SdlAnalysisResult {
    const symbolTable = new SymbolTable();

    const buildSymbolTableNodeHandler = new BuildSymbolTableNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, buildSymbolTableNodeHandler);

    symbolTable.resetScope();

    const validateScopeNodeHandler = new ValidateScopeNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, validateScopeNodeHandler);

    symbolTable.resetScope();

    const validateTypeNodeHandler = new ValidateTypeNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, validateTypeNodeHandler);

    symbolTable.resetScope();

    const specificCheckNodeHandler = new SpecificCheckNodeHandler(
      symbolTable,
      this.strict,
      this.checks,
    );

    dispatchNodeHandler(specification, specificCheckNodeHandler);

    const allErrors = [
      ...buildSymbolTableNodeHandler.semanticErrors,
      ...validateScopeNodeHandler.semanticErrors,
      ...validateTypeNodeHandler.semanticErrors,
      ...specificCheckNodeHandler.semanticErrors,
    ];

    const seenErrors = new Set<string>();
    const semanticErrors = allErrors.filter((error) => {
      const key =
        `${error.errorMessage}:${error.location?.row}:${error.location?.column}`;

      if (seenErrors.has(key)) {
        return false;
      }

      seenErrors.add(key);
      return true;
    });

    const allWarnings = [
      ...buildSymbolTableNodeHandler.semanticWarnings,
      ...validateScopeNodeHandler.semanticWarnings,
      ...validateTypeNodeHandler.semanticWarnings,
      ...specificCheckNodeHandler.semanticWarnings,
    ];

    const seenWarnings = new Set<string>();
    const semanticWarnings = allWarnings.filter((warning) => {
      const key =
        `${warning.errorMessage}:${warning.location?.row}:${warning.location?.column}`;

      if (seenWarnings.has(key)) {
        return false;
      }

      seenWarnings.add(key);
      return true;
    });

    return {
      semanticErrors,
      semanticWarnings,
      specification,
      symbolTable,
    };
  }
}
