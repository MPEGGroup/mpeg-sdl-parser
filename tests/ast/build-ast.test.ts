import { describe, expect, test } from "bun:test";
import { buildAst } from "../../src/ast/build-ast.ts";
import {
  createLenientSdlParser,
  createStrictSdlParser,
} from "../../src/lezer/create-sdl-parser.ts";
import { SdlStringInput } from "../../src/lezer/sdl-string-input.ts";
import { Specification } from "../../src/ast/node/specification.ts";
import { ClassDeclaration } from "../../src/ast/node/class-declaration.ts";
import { Identifier } from "../../src/ast/node/identifier.ts";
import { ExpressionStatement } from "../../src/ast/node/expression-statement.ts";
import { UnaryExpression } from "../../src/ast/node/unary-expression.ts";
import { Token } from "../../src/ast/node/token.ts";
import { TokenKind } from "../../src/ast/node/enum/token-kind.ts";
import { MissingError } from "../../src/ast/node/missing-error.ts";

const lenientSdlParser = createLenientSdlParser();
const strictSdlParser = createStrictSdlParser();

describe("buildAst Tests", () => {
  test("Parse tree with parse error of missing token SyntacticParseError fails with non-lenient AST", () => {
    const sdlStringInput = new SdlStringInput("int i;");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    expect(() => buildAst(parseTree, sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Missing expected token: computed => { row: 1, column: 1, position: 0 }",
    );
  });

  test("Parse tree with parse error of missing expected node SyntacticParseError fails with non-lenient AST", () => {
    const sdlStringInput = new SdlStringInput("§");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    expect(() => buildAst(parseTree, sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Missing expected node: <ClassDeclaration> or <MapDeclaration> or <ComputedElementaryTypeDefinition> => { row: 1, column: 1, position: 0 }",
    );
  });

  test("Parse tree with no content works with non-lenient AST", () => {
    const sdlStringInput = new SdlStringInput("");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    buildAst(parseTree, sdlStringInput);
  });

  test("Parse tree with parse error of unexpected token SyntacticParseError fails with non-lenient AST", () => {
    const sdlStringInput = new SdlStringInput("1");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    expect(() => buildAst(parseTree, sdlStringInput)).toThrow(
      "SYNTACTIC ERROR: Unexpected token: 1 <IntegerLiteral> => { row: 1, column: 1, position: 0 }",
    );
  });

  test("Parse tree with parse error of token SyntacticParseError works with lenient AST", () => {
    const sdlStringInput = new SdlStringInput("int i;");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    buildAst(parseTree, sdlStringInput, true);
  });

  test("Parse tree with parse error of missing expected node SyntacticParseError works with lenient AST", () => {
    const sdlStringInput = new SdlStringInput("§");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    buildAst(parseTree, sdlStringInput, true);
  });

  test("Parse tree with no content works with lenient AST", () => {
    const sdlStringInput = new SdlStringInput("");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    buildAst(parseTree, sdlStringInput, true);
  });

  test("Parse tree with parse error of unexpected node SyntacticParseError works with lenient AST", () => {
    const sdlStringInput = new SdlStringInput("1");
    const parseTree = lenientSdlParser.parse(sdlStringInput);

    buildAst(parseTree, sdlStringInput, true);
  });

  test("buildAst - simple", () => {
    const sdlStringInput = new SdlStringInput("class A {}");
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);
    const classToken = new Token(
      TokenKind.CLASS,
      "class",
      { row: 1, column: 1, position: 0 },
    );
    const identifier = new Identifier(
      "A",
      new Token(
        TokenKind.IDENTIFIER,
        "A",
        { row: 1, column: 7, position: 6 },
      ),
    );
    const openBraceToken = new Token(
      TokenKind.OPEN_BRACE,
      "{",
      { row: 1, column: 9, position: 8 },
    );
    const closeBraceToken = new Token(
      TokenKind.CLOSE_BRACE,
      "}",
      { row: 1, column: 10, position: 9 },
    );

    expect(
      specification,
    ).toEqual(
      new Specification(
        [
          new ClassDeclaration(
            undefined,
            undefined,
            undefined,
            classToken,
            identifier,
            undefined,
            undefined,
            undefined,
            openBraceToken,
            [],
            closeBraceToken,
            [classToken, identifier, openBraceToken, closeBraceToken],
          ),
        ],
      ),
    );
  });

  test("buildAst - simple with comments", () => {
    const sdlStringInput = new SdlStringInput(
      "// hello\nclass A {// world\n}// again",
    );
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    const classToken = new Token(
      TokenKind.CLASS,
      "class",
      { row: 2, column: 1, position: 9 },
    );
    const identifier = new Identifier(
      "A",
      new Token(
        TokenKind.IDENTIFIER,
        "A",
        { row: 2, column: 7, position: 15 },
      ),
    );
    const openBraceToken = new Token(
      TokenKind.OPEN_BRACE,
      "{",
      { row: 2, column: 9, position: 17 },
    );
    const closeBraceToken = new Token(
      TokenKind.CLOSE_BRACE,
      "}",
      { row: 3, column: 1, position: 27 },
    );

    const classDeclaration = new ClassDeclaration(
      undefined,
      undefined,
      undefined,
      classToken,
      identifier,
      undefined,
      undefined,
      undefined,
      openBraceToken,
      [],
      closeBraceToken,
      [classToken, identifier, openBraceToken, closeBraceToken],
    );

    classDeclaration.leadingTrivia = [
      { text: "// hello", location: { row: 1, column: 1, position: 0 } },
    ];
    classDeclaration.trailingTrivia = [
      { text: "// again", location: { row: 3, column: 2, position: 28 } },
    ];
    openBraceToken.trailingTrivia = [
      { text: "// world", location: { row: 2, column: 10, position: 18 } },
    ];

    expect(
      specification,
    ).toEqual(
      new Specification(
        [
          classDeclaration,
        ],
      ),
    );
  });

  test("buildAst - lenient with missing identifier", () => {
    const sdlStringInput = new SdlStringInput("class {}");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput, true);
    const classToken = new Token(
      TokenKind.CLASS,
      "class",
      { row: 1, column: 1, position: 0 },
    );
    const identifier = new MissingError({ row: 1, column: 7, position: 6 });
    const openBraceToken = new Token(
      TokenKind.OPEN_BRACE,
      "{",
      { row: 1, column: 7, position: 6 },
    );
    const closeBraceToken = new Token(
      TokenKind.CLOSE_BRACE,
      "}",
      { row: 1, column: 8, position: 7 },
    );

    expect(
      specification,
    ).toEqual(
      new Specification(
        [
          new ClassDeclaration(
            undefined,
            undefined,
            undefined,
            classToken,
            identifier,
            undefined,
            undefined,
            undefined,
            openBraceToken,
            [],
            closeBraceToken,
            [classToken, identifier, openBraceToken, closeBraceToken],
          ),
        ],
      ),
    );
  });

  test("buildAst - lenient with multiple missing tokens", () => {
    const sdlStringInput = new SdlStringInput("class A { - }");
    const parseTree = lenientSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput, true);

    const classToken = new Token(
      TokenKind.CLASS,
      "class",
      { row: 1, column: 1, position: 0 },
    );
    const identifier = new Identifier(
      "A",
      new Token(
        TokenKind.IDENTIFIER,
        "A",
        { row: 1, column: 7, position: 6 },
      ),
    );
    const openBraceToken = new Token(
      TokenKind.OPEN_BRACE,
      "{",
      { row: 1, column: 9, position: 8 },
    );
    const unaryOperatorToken = new Token(
      TokenKind.UNARY_NEGATION,
      "-",
      { row: 1, column: 11, position: 10 },
    );
    const missingOperandToken = new MissingError({
      row: 1,
      column: 13,
      position: 12,
    });
    const unaryExpression = new UnaryExpression(
      unaryOperatorToken,
      undefined,
      missingOperandToken,
      undefined,
      undefined,
      undefined,
      undefined,
      [unaryOperatorToken, missingOperandToken],
    );
    const missingSemicolonPunctuator = new MissingError({
      row: 1,
      column: 13,
      position: 12,
    });

    const expressionStatement = new ExpressionStatement(
      unaryExpression,
      missingSemicolonPunctuator,
      [unaryExpression, missingSemicolonPunctuator],
    );
    const closeBraceToken = new Token(
      TokenKind.CLOSE_BRACE,
      "}",
      { row: 1, column: 13, position: 12 },
    );

    expect(
      specification,
    ).toEqual(
      new Specification(
        [
          new ClassDeclaration(
            undefined,
            undefined,
            undefined,
            classToken,
            identifier,
            undefined,
            undefined,
            undefined,
            openBraceToken,
            [
              expressionStatement,
            ],
            closeBraceToken,
            [
              classToken,
              identifier,
              openBraceToken,
              expressionStatement,
              closeBraceToken,
            ],
          ),
        ],
      ),
    );
  });

  test("buildAst - comment within syntax element", () => {
    const sdlStringInput = new SdlStringInput("class A {i++// comment\n;}");
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);
    const classToken = new Token(
      TokenKind.CLASS,
      "class",
      { row: 1, column: 1, position: 0 },
    );
    const identifier = new Identifier(
      "A",
      new Token(
        TokenKind.IDENTIFIER,
        "A",
        { row: 1, column: 7, position: 6 },
      ),
    );
    const openBraceToken = new Token(
      TokenKind.OPEN_BRACE,
      "{",
      { row: 1, column: 9, position: 8 },
    );
    const identifier2 = new Identifier(
      "i",
      new Token(
        TokenKind.IDENTIFIER,
        "i",
        { row: 1, column: 10, position: 9 },
      ),
    );
    const postfixOperatorToken = new Token(
      TokenKind.POSTFIX_INCREMENT,
      "++",
      { row: 1, column: 11, position: 10 },
    );

    const unaryExpression2 = new UnaryExpression(
      undefined,
      undefined,
      identifier2,
      undefined,
      undefined,
      undefined,
      postfixOperatorToken,
      [identifier2, postfixOperatorToken],
    );
    const unaryExpression = new UnaryExpression(
      undefined,
      undefined,
      unaryExpression2,
      undefined,
      undefined,
      undefined,
      undefined,
      [unaryExpression2],
    );

    unaryExpression2.trailingTrivia = [
      {
        text: "// comment",
        location: { row: 1, column: 13, position: 12 },
      },
    ];

    const semicolonPunctuator = new Token(
      TokenKind.SEMICOLON,
      ";",
      { row: 2, column: 1, position: 23 },
    );
    const expressionStatement = new ExpressionStatement(
      unaryExpression,
      semicolonPunctuator,
      [unaryExpression, semicolonPunctuator],
    );
    const closeBraceToken = new Token(
      TokenKind.CLOSE_BRACE,
      "}",
      { row: 2, column: 2, position: 24 },
    );

    expect(
      specification,
    ).toEqual(
      new Specification(
        [
          new ClassDeclaration(
            undefined,
            undefined,
            undefined,
            classToken,
            identifier,
            undefined,
            undefined,
            undefined,
            openBraceToken,
            [
              expressionStatement,
            ],
            closeBraceToken,
            [
              classToken,
              identifier,
              openBraceToken,
              expressionStatement,
              closeBraceToken,
            ],
          ),
        ],
      ),
    );
  });

  test("buildAst - JSON", () => {
    const sdlStringInput = new SdlStringInput("computed int i;");
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);
    const actual = JSON.stringify(specification);

    expect(actual).toMatchSnapshot();
  });

  test("buildAst - leading and trailing comments", () => {
    const sdlStringInput = new SdlStringInput(
      "class A {// trailing 1\ni++; // trailing 2\n//leading 1\nN = N + // trailing 3\n 1;}\n// trailing 4",
    );
    const parseTree = strictSdlParser.parse(sdlStringInput);
    const specification = buildAst(parseTree, sdlStringInput);

    expect(specification).toMatchSnapshot();
  });
});
