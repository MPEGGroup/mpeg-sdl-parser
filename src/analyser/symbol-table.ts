import { InternalScannerError } from "../scanner-error.ts";
import type { Location } from "../location.ts";
import getLogger from "../util/logger.ts";
import type { AbstractCompositeNode } from "../ast/node/abstract-composite-node.ts";

const logger = getLogger("SymbolTable");

/**
 * Enum representing different numeric variable types.
 */
export enum NumericType {
  INTEGER,
  DECIMAL,
  FLOATING_POINT,
}

/**
 * Enum representing different string variable types.
 */
export enum StringType {
  BASIC,
  UCS,
}

/**
 * Enum representing different kinds of semantic symbols.
 */
export enum SymbolKind {
  CLASS,
  MAP,
  VARIABLE,
}

export enum AddSymbolResult {
  SUCCESS,
  DUPLICATE,
  MEMBER_CONFLICT,
}

/**
 * Enum representing different kinds of scopes.
 */
export enum ScopeKind {
  GLOBAL,
  BLOCK,
  CLASS,
  MAP,
}

export interface SymbolAttributes {
  isComputed?: boolean;
  isConst?: boolean;
  isString?: boolean;
  isArray?: boolean;

  // Used for numeric variables
  numericType?: NumericType;

  // Used for string variables
  stringType?: StringType;

  // Used for array of class types, Map class output type or Class definition
  classType?: string;

  // Used for Map definition
  mapType?: string;
}

export interface Symbol {
  name: string;
  kind: SymbolKind;
  attributes: SymbolAttributes;
  location: Location;
  node: AbstractCompositeNode;
}

/**
 * Used to differentiate between class members defined in different branches of conditional statements within the same class scope.
 * SDL allows such members to have the same name, but they are considered distinct members that may
 * or may not be present at runtime depending on the conditions.
 * The branchId is a string that represents the path of scopes from the class scope to the nested current scope.
 */
export interface ClassMemberSymbol {
  symbol: Symbol;
  branchId?: string;
}

export interface Scope {
  name: string;
  parent?: Scope;
  children: Scope[];
  symbols: Map<string, Symbol>;
  classMemberSymbols?: Map<string, ClassMemberSymbol[]>;
  kind: ScopeKind;
}

export enum Mode {
  READ,
  WRITE,
}

export class SymbolTable {
  private globalScope: Scope;
  private currentScope: Scope;
  private scopeNameCounters: Map<Scope, Map<string, number>> = new Map();
  private mode: Mode = Mode.WRITE;

  constructor() {
    this.globalScope = {
      symbols: new Map(),
      children: [],
      name: "GLOBAL",
      kind: ScopeKind.GLOBAL,
    };
    this.currentScope = this.globalScope;
  }

  private nextScopeName(baseName: string): string {
    if (!this.scopeNameCounters.has(this.currentScope)) {
      this.scopeNameCounters.set(this.currentScope, new Map());
    }

    const counters = this.scopeNameCounters.get(this.currentScope)!;
    const count = counters.get(baseName) ?? 0;

    counters.set(baseName, count + 1);

    return (count === 0) ? baseName : `${baseName}#${count}`;
  }

  private getCurrentBranchId(): string | undefined {
    const classScope = this.getEnclosingClassScope();

    if (!classScope || (this.currentScope === classScope)) {
      return undefined;
    }

    const parts: string[] = [];
    let scope: Scope | undefined = this.currentScope;

    while (scope && (scope !== classScope)) {
      if (scope.name) {
        parts.unshift(scope.name);
      }
      scope = scope.parent;
    }

    return (parts.length > 0) ? parts.join("/") : undefined;
  }

  private defineClassMember(symbol: Symbol): AddSymbolResult {
    const classScope = this.getEnclosingClassScope();

    if (!classScope) {
      throw new InternalScannerError(
        `Attempt to define class member '${symbol.name}' outside of class scope`,
      );
    }

    if (!classScope.classMemberSymbols) {
      classScope.classMemberSymbols = new Map();
    }

    const members = classScope.classMemberSymbols;

    if (!members.has(symbol.name)) {
      members.set(symbol.name, []);
    }

    // check for existing member with same name but different elementary type or string variable kind defined in different branch of conditional statement
    const existingMembers = members.get(symbol.name)!;

    for (const memberEntry of existingMembers) {
      const member = memberEntry.symbol;

      if (member.attributes.numericType !== symbol.attributes.numericType) {
        logger.debug(
          `Defined class member: ${symbol.name} in class scope: ${
            classScope.name ?? "anonymous"
          } conflicts with existing member type: ${symbol.attributes.numericType} != ${symbol.attributes.numericType}`,
        );
        return AddSymbolResult.MEMBER_CONFLICT;
      } else if (
        member.attributes.stringType !== symbol.attributes.stringType
      ) {
        logger.debug(
          `Defined class member: ${symbol.name} in class scope: ${
            classScope.name ?? "anonymous"
          } conflicts with existing member type: ${symbol.attributes.stringType} != ${symbol.attributes.stringType}`,
        );
        return AddSymbolResult.MEMBER_CONFLICT;
      }
    }

    const branchId = this.getCurrentBranchId();

    existingMembers.push({ symbol, branchId });

    logger.debug(
      `Defined class member: ${symbol.name} in class scope: ${
        classScope.name ?? "anonymous"
      }${branchId ? ` (branch: ${branchId})` : ""}`,
    );

    return AddSymbolResult.SUCCESS;
  }

  private enterScope(baseName: string, scopeKind: ScopeKind): void {
    const name = this.nextScopeName(baseName);

    let child = this.currentScope.children.find((c) => c.name === name);

    if (child && (this.mode === Mode.WRITE)) {
      throw new InternalScannerError(
        `Scope with name '${name}' already exists in current scope '${this.currentScope.name}'`,
      );
    }

    if (!child && (this.mode === Mode.READ)) {
      throw new InternalScannerError(
        `Scope with name '${name}' does not exist in current scope '${this.currentScope.name}'`,
      );
    }

    // Add the scope if if doesn't already exist
    if (!child) {
      child = {
        symbols: new Map(),
        parent: this.currentScope,
        children: [],
        name,
        kind: scopeKind,
      };
      this.currentScope.children.push(child);
    }

    this.currentScope = child;

    logger.debug(`Entered ${ScopeKind[scopeKind]} scope: ${name}`);
  }

  getEnclosingClassScope(): Scope | undefined {
    let scope: Scope | undefined = this.currentScope;

    while (scope) {
      if (scope.kind === ScopeKind.CLASS) {
        return scope;
      }
      scope = scope.parent;
    }

    return undefined;
  }

  enterBlockScope(baseName: string): void {
    this.enterScope(baseName, ScopeKind.BLOCK);
  }

  enterClassScope(baseName: string): void {
    this.enterScope(baseName, ScopeKind.CLASS);
  }

  enterMapScope(baseName: string): void {
    this.enterScope(baseName, ScopeKind.MAP);
  }

  exitScope(): void {
    if (this.currentScope.parent) {
      logger.debug(
        `Exiting ${
          ScopeKind[this.currentScope.kind]
        } scope: ${this.currentScope.name}`,
      );

      this.currentScope = this.currentScope.parent;

      return;
    }

    throw new InternalScannerError("Cannot exit global scope");
  }

  getCurrentScope(): Scope {
    return this.currentScope;
  }

  getGlobalScope(): Scope {
    return this.globalScope;
  }

  resetScope(): void {
    this.currentScope = this.globalScope;
    this.scopeNameCounters.clear();
    this.mode = Mode.READ;
  }

  addSymbol(symbol: Symbol): AddSymbolResult {
    if (this.mode === Mode.READ) {
      throw new InternalScannerError(
        `Attempt to add symbol '${symbol.name}' in read-only mode`,
      );
    }

    if (this.currentScope.symbols.has(symbol.name)) {
      return AddSymbolResult.DUPLICATE;
    }

    if (this.currentScope !== this.globalScope) {
      if (symbol.kind === SymbolKind.CLASS) {
        throw new InternalScannerError(
          `Class symbol '${symbol.name}' must be defined in global scope`,
        );
      }
      if (symbol.kind === SymbolKind.MAP) {
        throw new InternalScannerError(
          `Map symbol '${symbol.name}' must be defined in global scope`,
        );
      }
    }

    this.currentScope.symbols.set(symbol.name, symbol);

    logger.debug(
      `Defined symbol: ${symbol.name} in scope: ${
        this.currentScope.name ?? "anonymous"
      }`,
    );

    // if in a class scope and if variable is parsed (regardless of nested level) or if
    // variable is computed (and in in top level of class scope) then define variable as a class member
    if (
      this.getEnclosingClassScope() &&
      ((symbol.attributes.isComputed !== true) ||
        (this.currentScope.kind === ScopeKind.CLASS))
    ) {
      if (this.defineClassMember(symbol) !== AddSymbolResult.SUCCESS) {
        return AddSymbolResult.MEMBER_CONFLICT;
      }
    }

    return AddSymbolResult.SUCCESS;
  }

  lookupClassMember(name: string): ClassMemberSymbol[] | undefined {
    const classScope = this.getEnclosingClassScope();

    if (!classScope?.classMemberSymbols) {
      return undefined;
    }

    return classScope.classMemberSymbols.get(name);
  }

  lookupVariable(name: string): Symbol | undefined {
    let scope: Scope | undefined = this.currentScope;

    while (scope) {
      const symbol = scope.symbols.get(name);

      if (symbol && (symbol.kind === SymbolKind.VARIABLE)) {
        return symbol;
      }

      scope = scope.parent;
    }
    return undefined;
  }

  lookupClass(name: string): Symbol | undefined {
    const symbol = this.globalScope.symbols.get(name);

    if (symbol && (symbol.kind === SymbolKind.CLASS)) {
      return symbol;
    }

    return undefined;
  }

  lookupMap(name: string): Symbol | undefined {
    const symbol = this.globalScope.symbols.get(name);

    if (symbol && (symbol.kind === SymbolKind.MAP)) {
      return symbol;
    }

    return undefined;
  }
}
