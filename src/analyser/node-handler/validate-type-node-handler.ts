import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { NodeHandler } from "../../ast/visitor/node-handler.ts";
import type { SemanticError } from "../../scanner-error.ts";
import type { SymbolTable } from "../symbol-table.ts";

export class ValidateTypeNodeHandler implements NodeHandler {

    public readonly semanticErrors: Array<SemanticError> = [];

    constructor(public readonly symbolTable: SymbolTable) {}

    beforeVisit(node: AbstractCompositeNode): void {
        throw new Error("Method not implemented.");
    }
    visit(node: AbstractLeafNode): void {
        throw new Error("Method not implemented.");
    }
    afterVisit(node: AbstractCompositeNode): void {
        throw new Error("Method not implemented.");
    }
}