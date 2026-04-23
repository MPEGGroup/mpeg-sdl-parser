import { describe, expect, test } from "bun:test";
import { SymbolKind, SymbolTable } from "../../../src/analyser/symbol-table.ts";
import { getSymbolTableString } from "../../../src/analyser/util/symbol-table-utils.ts";
import { Identifier } from "../../../src/ast/node/identifier.ts";
import { TokenKind } from "../../../src/ast/node/enum/token-kind.ts";
import { Token } from "../../../src/ast/node/token.ts";

const node = new Identifier(
  "foo",
  new Token(TokenKind.IDENTIFIER, "foo", { row: 1, column: 1, position: 0 }),
);

describe("Symbol Table Utils Tests", () => {
  test("toString outputs human-readable format", () => {
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

    const output = getSymbolTableString(table);

    expect(output).toContain("[GLOBAL]");
    expect(output).toContain("MyClass CLASS");
    expect(output).toContain("MyMap MAP");
  });

  test("toString includes nested scopes", () => {
    const table = new SymbolTable();

    table.addSymbol({
      node,
      name: "GlobalClass",
      kind: SymbolKind.CLASS,
      attributes: {},
      location: { row: 1, column: 1, position: 0 },
    });
    table.enterClassScope("MyClass");
    table.addSymbol({
      node,
      name: "param1",
      kind: SymbolKind.VARIABLE,
      attributes: {},
      location: { row: 2, column: 1, position: 10 },
    });

    const output = getSymbolTableString(table);

    expect(output).toContain("[GLOBAL]");
    expect(output).toContain("GlobalClass CLASS");
    expect(output).toContain("[CLASS] MyClass:");
    expect(output).toContain("param1 VARIABLE");
  });
});
