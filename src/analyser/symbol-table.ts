import { InternalScannerError } from "../scanner-error.ts";
import { SymbolKind } from "./enum/symbol-kind.ts";
import type { Symbol } from "./symbol.ts";

export interface Scope {
  symbols: Map<string, Symbol>;
  parent?: Scope;
  children: Scope[];
  scopeName?: string;
}

export class SymbolTable {
  private globalScope: Scope;
  private currentScope: Scope;
  private scopeStack: Scope[] = [];

  constructor() {
    this.globalScope = {
      symbols: new Map(),
      children: [],
      scopeName: "global",
    };
    this.currentScope = this.globalScope;
    this.scopeStack.push(this.globalScope);
  }

  enterScope(scopeName?: string): void {
    const newScope: Scope = {
      symbols: new Map(),
      parent: this.currentScope,
      children: [],
      scopeName,
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
    return true;
  }

  defineGlobal(symbol: Symbol): boolean {
    if (this.globalScope.symbols.has(symbol.name)) {
      return false;
    }
    this.globalScope.symbols.set(symbol.name, symbol);
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

  lookupClass(name: string): Symbol | undefined {
    const symbol = this.globalScope.symbols.get(name);
    if (symbol && symbol.kind === SymbolKind.CLASS) {
      return symbol;
    }
    return undefined;
  }

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

  getCurrentScopeName(): string | undefined {
    return this.currentScope.scopeName;
  }

  toString(): string {
    const lines: string[] = [];
    const formatScope = (scope: Scope, indent: number): void => {
      const prefix = "  ".repeat(indent);
      const scopeLabel = scope.scopeName ?? "anonymous";

      lines.push(`${prefix}[${scopeLabel}]`);

      for (const [name, symbol] of scope.symbols) {
        const kindName = SymbolKind[symbol.kind];
        let typeStr = "";

        if (symbol.attributes) {
          const parts: string[] = [];

          if (symbol.attributes.isConst) {
            parts.push("const");
          }

          if (symbol.attributes.isComputed) {
            parts.push("computed");
          }

          if (symbol.attributes.elementaryType) {
            const typeKeyword = symbol.attributes.elementaryType.typeKeyword;

            if ("text" in typeKeyword) {
              parts.push(typeKeyword.text);
            }
          } else if (symbol.attributes.classReference) {
            parts.push(symbol.attributes.classReference);
          }

          if (symbol.attributes.isArray) {
            parts.push("[]");
          }
          typeStr = parts.length > 0 ? `: ${parts.join(" ")}` : "";
        }
        lines.push(`${prefix}  ${name} (${kindName})${typeStr}`);
      }

      for (const child of scope.children) {
        formatScope(child, indent + 1);
      }
    };

    formatScope(this.globalScope, 0);

    return lines.join("\n");
  }
}
