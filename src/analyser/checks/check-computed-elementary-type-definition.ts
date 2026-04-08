import type { ComputedElementaryTypeDefinition } from "../../ast/node/computed-elementary-type-definition";
import { NodeKind } from "../../ast/node/enum/node-kind";
import { StatementKind } from "../../ast/node/enum/statement-kind";
import type { SymbolTable } from "../symbol-table";
import { getRequiredIdentifier } from "../util/symbol-table-utils";
import type { Check, CheckResult } from "./check";

export const checkComputedElementaryTypeDefinition: Check = {
    nodeKind: NodeKind.STATEMENT,
    subKind: StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION,
    checkFunc: function (definition: ComputedElementaryTypeDefinition, symbolTable: SymbolTable, strict: boolean): CheckResult[] {

        if (definition.value !== undefined) {
            return [];
        }
        
        const identifier = getRequiredIdentifier(
            definition.identifier,
            definition,
            strict,
        );
    
        if (!identifier) {
            return [];
        }
        
        // get the symbol using the identifier.name
        const symbol = symbolTable.lookupVariable(identifier.name);
    
        if (!symbol || !symbol.attributes.isConst) {
            return [];
        }
        
        return [
            {
                message: `${identifier.name}: const computed elementary type definition must have a value specified`,
                location: identifier.startToken!.location,
            }
        ];
    }
};
