import type { Specification } from "../ast/node/specification.ts";
import { dispatchNodeHandler } from "../parse-helper.ts";
import type { SemanticError } from "../scanner-error.ts";
import { BuildSymbolTableNodeHandler } from "./node-handler/build-symbol-table-node-handler.ts";
import type { Check } from "./check.ts";
import { ValidateScopeNodeHandler } from "./node-handler/validate-scope-node-handler.ts";
import { ValidateTypeNodeHandler } from "./node-handler/validate-type-node-handler.ts";
import type { SymbolTable } from "./symbol-table.ts";

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
    const buildSymbolTableNodeHandler = new BuildSymbolTableNodeHandler(
      this.strict,
    );

    dispatchNodeHandler(specification, buildSymbolTableNodeHandler);

    const symbolTable = buildSymbolTableNodeHandler.symbolTable;
    const scopeValidationNodeHandler = new ValidateScopeNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, scopeValidationNodeHandler);

    const typeValidationNodeHandler = new ValidateTypeNodeHandler(
      symbolTable,
      this.strict,
    );

    dispatchNodeHandler(specification, typeValidationNodeHandler);

    return {
      semanticErrors: [
        ...scopeValidationNodeHandler.semanticErrors,
        ...typeValidationNodeHandler.semanticErrors,
      ],
      specification,
      symbolTable,
    };
  }
}
