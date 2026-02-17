import type { SemanticError } from "../../scanner-error.ts";
import type { SymbolTable } from "../symbol-table.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import type { MapDeclaration } from "../../ast/node/map-declaration.ts";
import {
  getRequiredIdentifier,
  getRequiredOperand,
  getRequiredToken,
} from "../util/symbol-table-utils.ts";

export class ValidateTypeNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];

  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(symbolTable, strict);

    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.CLASS_DECLARATION,
      (node) => this.handleClassDeclaration(node as ClassDeclaration),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DECLARATION,
      (node) => this.handleMapDeclaration(node as MapDeclaration),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      (_node) =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.FOR]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPOUND,
      (_node) =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.COMPOUND]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.WHILE,
      (_node) =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.WHILE]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.DO,
      (_node) =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.DO]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.SWITCH,
      (_node) =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.SWITCH]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.BINARY,
      (node) => this.handleBinaryExpression(node as BinaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.UNARY,
      (node) => this.handleUnaryExpression(node as UnaryExpression),
    );

    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      (_node) => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPOUND,
      (_node) => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.WHILE,
      (_node) => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.DO,
      (_node) => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.SWITCH,
      (_node) => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.CLASS_DECLARATION,
      (_node) => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DECLARATION,
      (_node) => this.symbolTable.exitScope(),
    );
  }

  private handleClassDeclaration(classDeclaration: ClassDeclaration): void {
    const identifier = getRequiredIdentifier(
      classDeclaration.identifier,
      classDeclaration,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    this.symbolTable.enterClassScope(identifier.name);
  }

  private handleMapDeclaration(mapDeclaration: MapDeclaration): void {
    const identifier = getRequiredIdentifier(
      mapDeclaration.identifier,
      mapDeclaration,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    this.symbolTable.enterMapScope(identifier.name);
  }

  private handleBinaryExpression(binaryExpression: BinaryExpression): void {
    const leftOperand = getRequiredOperand(
      binaryExpression.leftOperand,
      binaryExpression,
      this.strict,
    );

    if (!leftOperand) {
      return;
    }

    const rightOperand = getRequiredOperand(
      binaryExpression.rightOperand,
      binaryExpression,
      this.strict,
    );

    if (!rightOperand) {
      return;
    }

    const operatorToken = getRequiredToken(
      binaryExpression.binaryOperator,
      binaryExpression,
      this.strict,
    );

    if (!operatorToken) {
      return;
    }

    // TODO: Validate that the right operand type is compatible with the left operand type
  }

  private handleUnaryExpression(unaryExpression: UnaryExpression): void {
    const operand = getRequiredOperand(
      unaryExpression.operand,
      unaryExpression,
      this.strict,
    );

    if (!operand) {
      return;
    }

    // TODO: Add type checks for unary operators (e.g., negation requires numeric type)
  }
}
