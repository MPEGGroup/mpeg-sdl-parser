import { describe, expect, test } from "bun:test";
import { SymbolTable } from "../../src/analyser/symbol-table.ts";
import { SymbolKind } from "../../src/analyser/enum/symbol-kind.ts";
import { type Symbol } from "../../src/analyser/symbol.ts";

describe("Symbol Table Tests", () => {
  test("Test symbol table creation", () => {
    const table = new SymbolTable();

    expect(table.getScopeDepth()).toBe(1);
    expect(table.getCurrentScopeName()).toBe("global");
  });

  test("Define and lookup symbol in global scope", () => {
    const table = new SymbolTable();
    const symbol: Symbol = {
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };

    expect(table.define(symbol)).toBe(true);
    expect(table.lookup("MyClass")).toBe(symbol);
    expect(table.lookupGlobal("MyClass")).toBe(symbol);
  });

  test("Prevent duplicate symbol definition", () => {
    const table = new SymbolTable();
    const symbol1: Symbol = {
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };
    const symbol2: Symbol = {
      name: "MyClass",
      kind: SymbolKind.MAP,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };

    expect(table.define(symbol1)).toBe(true);
    expect(table.define(symbol2)).toBe(false);
    expect(table.lookup("MyClass")).toBe(symbol1);
  });

  test("Enter and exit scope", () => {
    const table = new SymbolTable();

    expect(table.getScopeDepth()).toBe(1);

    table.enterScope("inner");

    expect(table.getScopeDepth()).toBe(2);
    expect(table.getCurrentScopeName()).toBe("inner");

    table.exitScope();

    expect(table.getScopeDepth()).toBe(1);
    expect(table.getCurrentScopeName()).toBe("global");
  });

  test("Lookup traverses parent scopes", () => {
    const table = new SymbolTable();
    const globalSymbol: Symbol = {
      name: "globalVar",
      kind: SymbolKind.VARIABLE,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };

    table.define(globalSymbol);

    table.enterScope("inner");

    const innerSymbol: Symbol = {
      name: "innerVar",
      kind: SymbolKind.VARIABLE,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };

    table.define(innerSymbol);

    expect(table.lookup("globalVar")).toBe(globalSymbol);
    expect(table.lookup("innerVar")).toBe(innerSymbol);
    expect(table.lookupInCurrentScope("globalVar")).toBeUndefined();
    expect(table.lookupInCurrentScope("innerVar")).toBe(innerSymbol);
  });

  test("lookupClass returns only CLASS symbols", () => {
    const table = new SymbolTable();

    table.define({
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.define({
      name: "MyMap",
      kind: SymbolKind.MAP,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });

    expect(table.lookupClass("MyClass")).toBeDefined();
    expect(table.lookupClass("MyMap")).toBeUndefined();
  });

  test("lookupMap returns only MAP symbols", () => {
    const table = new SymbolTable();

    table.define({
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.define({
      name: "MyMap",
      kind: SymbolKind.MAP,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });

    expect(table.lookupMap("MyMap")).toBeDefined();
    expect(table.lookupMap("MyClass")).toBeUndefined();
  });

  test("toString outputs human-readable format", () => {
    const table = new SymbolTable();

    table.define({
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.define({
      name: "MyMap",
      kind: SymbolKind.MAP,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });

    const output = table.toString();

    expect(output).toContain("[global]");
    expect(output).toContain("MyClass (CLASS)");
    expect(output).toContain("MyMap (MAP)");
  });

  test("toString includes nested scopes", () => {
    const table = new SymbolTable();

    table.define({
      name: "GlobalClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.enterScope("MyClass");
    table.define({
      name: "param1",
      kind: SymbolKind.PARAMETER,
      attributes: {},
      location: { row: 2, column: 1, position: 10 },
    });

    const output = table.toString();

    expect(output).toContain("[global]");
    expect(output).toContain("GlobalClass (CLASS)");
    expect(output).toContain("[MyClass]");
    expect(output).toContain("param1 (PARAMETER)");
  });

  test("toString includes type information", () => {
    const table = new SymbolTable();

    table.define({
      name: "myVar",
      kind: SymbolKind.VARIABLE,
      attributes: {
        classReference: "SomeClass",
        isArray: true,
        isConst: true,
      },
      location: { row: 3, column: 1, position: 20 },
    });

    const output = table.toString();

    expect(output).toContain("myVar (VARIABLE): const SomeClass []");
  });
});
