import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { NodeKind } from "../../ast/node/enum/node-kind.ts";
import type { Location } from "../../location.ts";
import type { SymbolTable } from "../symbol-table.ts";

export interface CheckResult {
  message: string;
  location: Location;
  isWarning?: boolean;
}

export interface Check {
  nodeKind: NodeKind;
  subKind?: number;
  checkFunc(node: AbstractCompositeNode, symbolTable: SymbolTable, strict: boolean): CheckResult[];
}
