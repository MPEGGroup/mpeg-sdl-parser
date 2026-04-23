import { describe, expect, test } from "bun:test";
import {
  AddSymbolResult,
  NumericType,
  ScopeKind,
  type Symbol,
  SymbolKind,
  SymbolTable,
} from "../../src/analyser/symbol-table.ts";
import { TokenKind } from "../../src/ast/node/enum/token-kind.ts";
import { Token } from "../../src/ast/node/token.ts";
import { Identifier } from "../../src/ast/node/identifier.ts";

describe("Symbol Table Tests", () => {
  const node = new Identifier(
    "foo",
    new Token(TokenKind.IDENTIFIER, "foo", { row: 1, column: 1, position: 0 }),
  );

  test("Test symbol table creation", () => {
    const table = new SymbolTable();

    expect(table.getCurrentScope().kind).toBe(ScopeKind.GLOBAL);
  });

  test("Define and lookup symbol in global scope", () => {
    const table = new SymbolTable();
    const symbol: Symbol = {
      node,
      name: "MyVariable",
      kind: SymbolKind.VARIABLE,
      attributes: {
        isComputed: true,
        isConst: true,
      },
      location: { row: 1, column: 1, position: 0 },
    };

    expect(table.addSymbol(symbol)).toBe(AddSymbolResult.SUCCESS);
    expect(table.lookupVariable("MyVariable")).toBe(symbol);
  });

  test("Prevent duplicate symbol definition", () => {
    const table = new SymbolTable();
    const symbol1: Symbol = {
      node,
      name: "MyVariable",
      kind: SymbolKind.VARIABLE,
      attributes: {
        isComputed: true,
        isConst: true,
      },
      location: { row: 1, column: 1, position: 0 },
    };
    const symbol2: Symbol = {
      node,
      name: "MyVariable",
      kind: SymbolKind.VARIABLE,
      attributes: {
        isComputed: true,
        isConst: true,
      },
      location: { row: 1, column: 1, position: 0 },
    };

    expect(table.addSymbol(symbol1)).toBe(AddSymbolResult.SUCCESS);
    expect(table.addSymbol(symbol2)).toBe(AddSymbolResult.DUPLICATE);
    expect(table.lookupVariable("MyVariable")).toBe(symbol1);
  });

  test("Prevent conflicting member definition", () => {
    const table = new SymbolTable();

    const symbol1: Symbol = {
      node,
      name: "MyVariable",
      kind: SymbolKind.VARIABLE,
      attributes: {
        numericType: NumericType.INTEGER,
        isConst: true,
      },
      location: { row: 1, column: 1, position: 0 },
    };
    const symbol2: Symbol = {
      node,
      name: "MyVariable",
      kind: SymbolKind.VARIABLE,
      attributes: {
        numericType: NumericType.FLOATING_POINT,
        isConst: true,
      },
      location: { row: 1, column: 1, position: 0 },
    };

    table.enterClassScope("A");
    table.enterBlockScope("COMPOUND");
    expect(table.addSymbol(symbol1)).toBe(AddSymbolResult.SUCCESS);
    table.exitScope();
    table.enterBlockScope("COMPOUND");
    expect(table.addSymbol(symbol2)).toBe(AddSymbolResult.MEMBER_CONFLICT);
    table.exitScope();
  });

  test("Enter and exit scope", () => {
    const table = new SymbolTable();

    table.enterBlockScope("inner");

    expect(table.getCurrentScope().kind).toBe(ScopeKind.BLOCK);
    expect(table.getCurrentScope().name).toBe("inner");

    table.exitScope();

    expect(table.getCurrentScope().kind).toBe(ScopeKind.GLOBAL);
  });

  test("Lookup traverses parent scopes", () => {
    const table = new SymbolTable();
    const globalSymbol: Symbol = {
      node,
      name: "globalVar",
      kind: SymbolKind.VARIABLE,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };

    table.addSymbol(globalSymbol);

    table.enterBlockScope("inner");

    const innerSymbol: Symbol = {
      node,
      name: "innerVar",
      kind: SymbolKind.VARIABLE,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    };

    table.addSymbol(innerSymbol);

    expect(table.lookupVariable("globalVar")).toBe(globalSymbol);
    expect(table.lookupVariable("innerVar")).toBe(innerSymbol);
  });

  test("lookupClass returns only CLASS symbols", () => {
    const table = new SymbolTable();

    table.addSymbol({
      node,
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.addSymbol({
      node,
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

    table.addSymbol({
      node,
      name: "MyClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.addSymbol({
      node,
      name: "MyMap",
      kind: SymbolKind.MAP,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });

    expect(table.lookupMap("MyMap")).toBeDefined();
    expect(table.lookupMap("MyClass")).toBeUndefined();
  });
});
