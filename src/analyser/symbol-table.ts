import { ElementaryTypeKind } from "../ast/node/enum/elementary-type-kind.ts";
import { StringVariableKind } from "../ast/node/enum/string-variable-kind.ts";
import { InternalScannerError } from "../scanner-error.ts";
import { SymbolKind } from "./enum/symbol-kind.ts";
import type { Symbol } from "./symbol.ts";
import getLogger from "../util/logger.ts";

const logger = getLogger("SymbolTable");

export interface Scope {
  symbols: Map<string, Symbol>;
  parent?: Scope;
  children: Scope[];
  name?: string;
}

export class SymbolTable {
  private globalScope: Scope;
  private currentScope: Scope;
  private scopeStack: Scope[] = [];

  constructor() {
    this.globalScope = {
      symbols: new Map(),
      children: [],
      name: "global",
    };
    this.currentScope = this.globalScope;
    this.scopeStack.push(this.globalScope);
  }

  enterScope(name?: string): void {
    const newScope: Scope = {
      symbols: new Map(),
      parent: this.currentScope,
      children: [],
      name,
    };
    this.currentScope.children.push(newScope);
    this.scopeStack.push(newScope);
    this.currentScope = newScope;
  }

  exitScope(): void {
    if (this.scopeStack.length > 1) {
      this.scopeStack.pop();
      this.currentScope = this.scopeStack[this.scopeStack.length - 1];

      return;
    }

    throw new InternalScannerError("Cannot exit global scope");
  }

  define(symbol: Symbol): boolean {
    if (this.currentScope.symbols.has(symbol.name)) {
      return false;
    }

    this.currentScope.symbols.set(symbol.name, symbol);

    logger.debug(`Defined symbol: ${symbol.name} in scope: ${this.currentScope.name ?? "anonymous"}`);

    return true;
  }

  defineGlobal(symbol: Symbol): boolean {
    if (this.globalScope.symbols.has(symbol.name)) {
      return false;
    }

    this.globalScope.symbols.set(symbol.name, symbol);

    logger.debug(`Defined global symbol: ${symbol.name}`);
    return true;
  }

  lookup(name: string): Symbol | undefined {
    let scope: Scope | undefined = this.currentScope;

    while (scope) {
      const symbol = scope.symbols.get(name);

      if (symbol) {
        return symbol;
      }
      scope = scope.parent;
    }
    return undefined;
  }

  lookupInCurrentScope(name: string): Symbol | undefined {
    return this.currentScope.symbols.get(name);
  }

  lookupGlobal(name: string): Symbol | undefined {
    return this.globalScope.symbols.get(name);
  }

  // TODO: why this?
  lookupClass(name: string): Symbol | undefined {
    const symbol = this.globalScope.symbols.get(name);

    if (symbol && symbol.kind === SymbolKind.CLASS) {
      return symbol;
    }

    return undefined;
  }

  // TODO: why this?
  lookupMap(name: string): Symbol | undefined {
    const symbol = this.globalScope.symbols.get(name);
    if (symbol && symbol.kind === SymbolKind.MAP) {
      return symbol;
    }
    return undefined;
  }

  getCurrentScope(): Scope {
    return this.currentScope;
  }

  getGlobalScope(): Scope {
    return this.globalScope;
  }

  getScopeDepth(): number {
    return this.scopeStack.length;
  }

  toString(): string {
    const lines: string[] = [];
    const formatScope = (scope: Scope, indent: number): void => {
      const prefix = "  ".repeat(indent);
      const scopeLabel = scope.name ?? "anonymous";

      lines.push(`${prefix}[${scopeLabel}]`);

      for (const [name, symbol] of scope.symbols) {
        const kindName = SymbolKind[symbol.kind];
        let typeStr = "";

        if (symbol.attributes) {
          const attributes = symbol.attributes;
          const parts: string[] = [];

          if (attributes.isComputed) {
            parts.push("computed");
          }

          if (attributes.isConst) {
            parts.push("const");
          }

          if (attributes.stringVariableKind) {
            parts.push(StringVariableKind[attributes.stringVariableKind]);
          }

          if (attributes.elementaryTypeKind !== undefined) {
            parts.push(ElementaryTypeKind[attributes.elementaryTypeKind]);
          }

          if (attributes.classReference) {
            parts.push(attributes.classReference);
          }

          if (attributes.mapReference) {
            parts.push(attributes.mapReference);
          }

          if (attributes.isArray) {
            parts.push("[]");
          }

          typeStr = parts.length > 0 ? ` ${parts.join(" ")}` : "";
        }
        lines.push(`${prefix}  ${name} ${kindName}${typeStr}`);
      }

      for (const child of scope.children) {
        formatScope(child, indent + 1);
      }
    };

    formatScope(this.globalScope, 0);

    return lines.join("\n");
  }
}
