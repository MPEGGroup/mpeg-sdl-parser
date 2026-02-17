import type { Specification } from "../ast/node/specification.ts";
import { dispatchNodeHandler } from "../parse-helper.ts";
import type { SemanticError } from "../scanner-error.ts";
import { BuildSymbolTableNodeHandler } from "./node-handler/build-symbol-table-node-handler.ts";
import type { Check } from "./checks/check.ts";
import { ValidateScopeNodeHandler } from "./node-handler/validate-scope-node-handler.ts";
import { ValidateTypeNodeHandler } from "./node-handler/validate-type-node-handler.ts";
import { SymbolTable } from "./symbol-table.ts";

export interface SdlAnalysisResult {
  semanticErrors: Array<SemanticError>;
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
    const scopeValidationNodeHandler = new ValidateScopeNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, scopeValidationNodeHandler);

    symbolTable.resetScope();
    const typeValidationNodeHandler = new ValidateTypeNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, typeValidationNodeHandler);

    const allErrors = [
      ...buildSymbolTableNodeHandler.semanticErrors,
      ...scopeValidationNodeHandler.semanticErrors,
      ...typeValidationNodeHandler.semanticErrors,
    ];

    const seen = new Set<string>();
    const semanticErrors = allErrors.filter((error) => {
      const key =
        `${error.errorMessage}:${error.location?.row}:${error.location?.column}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    return {
      semanticErrors,
      specification,
      symbolTable,
    };
  }
}
