import type { Specification } from "../ast/node/specification.ts";
import { dispatchNodeHandler } from "../parse-helper.ts";
import type { SemanticError } from "../scanner-error.ts";
import { BuildSymbolTableNodeHandler } from "./node-handler/build-symbol-table-node-handler.ts";
import type { Check } from "./check.ts";
import { SymbolTable } from "./symbol-table.ts";
import { ValidateScopeNodeHandler } from "./node-handler/validate-scope-node-handler.ts";
import { ValidateTypeNodeHandler } from "./node-handler/validate-type-node-handler.ts";

export interface SdlAnalysisResult {
  semanticErrors: Array<SemanticError>;
  specification: Specification;
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
    const buildSymbolTableNodeHandler = new BuildSymbolTableNodeHandler(symbolTable);

    dispatchNodeHandler(specification, buildSymbolTableNodeHandler);

    const scopeValidationNodeHandler = new ValidateScopeNodeHandler(symbolTable);

    dispatchNodeHandler(specification, scopeValidationNodeHandler);

    const typeValidationNodeHandler = new ValidateTypeNodeHandler(symbolTable);

    dispatchNodeHandler(specification, typeValidationNodeHandler);

    return {
      semanticErrors: [
        ...scopeValidationNodeHandler.semanticErrors,
        ...typeValidationNodeHandler.semanticErrors,
      ],
      specification,
    };
  }
}
