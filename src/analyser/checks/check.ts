import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { NodeKind } from "../../ast/node/enum/node-kind.ts";

export interface CheckResult {
  message: string;
  isWarningOnly?: boolean;
}

export interface Check {
  nodeKind: NodeKind;
  subKind?: number;
  check(node: AbstractCompositeNode): CheckResult[];
}
