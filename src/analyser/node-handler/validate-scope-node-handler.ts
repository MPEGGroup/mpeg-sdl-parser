import type { SymbolTable } from "../symbol-table.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { ClassDefinition } from "../../ast/node/class-definition.ts";
import type { MapDefinition } from "../../ast/node/map-definition.ts";
import type { ArrayDefinition } from "../../ast/node/array-definition.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import type { ExtendsModifier } from "../../ast/node/extends-modifier.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { LengthofExpression } from "../../ast/node/length-of-expression.ts";
import { SemanticError } from "../../scanner-error.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import type { MapDeclaration } from "../../../dist/index.js";
import {
  getRequiredIdentifier,
  getRequiredOperand,
} from "../util/symbol-table-utils.ts";
import { isIdentifier } from "../../ast/util/types.ts";

export class ValidateScopeNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];

  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(symbolTable, strict);

    this.registerBeforeNodeHandler(
      NodeKind.EXTENDS_MODIFIER,
      undefined,
      (node) => this.handleExtendsModifier(node as ExtendsModifier),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.UNARY,
      (node) => this.handleUnaryExpression(node as UnaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.BINARY,
      (node) => this.handleBinaryExpression(node as BinaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.LENGTHOF,
      (node) => this.handleLengthofExpression(node as LengthofExpression),
    );
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
      StatementKind.CLASS_DEFINITION,
      (node) => this.handleClassDefinition(node as ClassDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DEFINITION,
      (node) => this.handleMapDefinition(node as MapDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.ARRAY_DEFINITION,
      (node) => this.handleArrayDefinition(node as ArrayDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.WHILE,
      () =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.WHILE]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.DO,
      () => this.symbolTable.enterBlockScope(StatementKind[StatementKind.DO]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      () => this.symbolTable.enterBlockScope(StatementKind[StatementKind.FOR]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.SWITCH,
      () =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.SWITCH]),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPOUND,
      () =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.COMPOUND]),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.SWITCH,
      () => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.WHILE,
      () => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.DO,
      () => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      () => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPOUND,
      () => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.CLASS_DECLARATION,
      () => this.symbolTable.exitScope(),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DECLARATION,
      () => this.symbolTable.exitScope(),
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

    if (isIdentifier(mapDeclaration.outputClassIdentifier)) {
      const classIdentifier = getRequiredIdentifier(
        mapDeclaration.outputClassIdentifier,
        mapDeclaration,
        this.strict,
      );

      if (!classIdentifier) {
        return;
      }

      this.checkClassReference(classIdentifier);
    }

    this.symbolTable.enterMapScope(identifier.name);
  }

  private handleClassDefinition(classDefinition: ClassDefinition): void {
    const classIdentifier = getRequiredIdentifier(
      classDefinition.classIdentifier,
      classDefinition,
      this.strict,
    );

    if (!classIdentifier) {
      return;
    }

    this.checkClassReference(classIdentifier);
  }

  private handleMapDefinition(mapDefinition: MapDefinition): void {
    const mapIdentifier = getRequiredIdentifier(
      mapDefinition.mapIdentifier,
      mapDefinition,
      this.strict,
    );

    if (!mapIdentifier) {
      return;
    }

    this.checkMapReference(mapIdentifier);

    if (isIdentifier(mapDefinition.classIdentifier)) {
      const classIdentifier = getRequiredIdentifier(
        mapDefinition.classIdentifier,
        mapDefinition,
        this.strict,
      );

      if (!classIdentifier) {
        return;
      }

      this.checkClassReference(classIdentifier);
    }
  }

  private handleArrayDefinition(arrayDefinition: ArrayDefinition): void {
    if (isIdentifier(arrayDefinition.classIdentifier)) {
      const classIdentifier = getRequiredIdentifier(
        arrayDefinition.classIdentifier,
        arrayDefinition,
        this.strict,
      );

      if (!classIdentifier) {
        return;
      }

      this.checkClassReference(classIdentifier);
    }
  }

  private handleExtendsModifier(extendsModifier: ExtendsModifier): void {
    const identifier = getRequiredIdentifier(
      extendsModifier.identifier,
      extendsModifier,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    this.checkClassReference(identifier);
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

    if (isIdentifier(operand)) {
      this.checkIdentifierReference(operand);
    }

    // Nested expressions will be visited recursively by the traversal
  }

  private handleBinaryExpression(binaryExpression: BinaryExpression): void {
    const leftOperand = getRequiredOperand(
      binaryExpression.leftOperand,
      binaryExpression,
      this.strict,
    );
    const rightOperand = getRequiredOperand(
      binaryExpression.rightOperand,
      binaryExpression,
      this.strict,
    );

    if (isIdentifier(leftOperand)) {
      this.checkIdentifierReference(leftOperand);
    }

    if (isIdentifier(rightOperand)) {
      this.checkIdentifierReference(rightOperand);
    }

    // Nested expressions will be visited recursively by the traversal
  }

  private handleLengthofExpression(
    lengthofExpression: LengthofExpression,
  ): void {
    const operand = getRequiredOperand(
      lengthofExpression.operand,
      lengthofExpression,
      this.strict,
    );

    if (!operand) {
      return;
    }

    if (isIdentifier(operand)) {
      this.checkIdentifierReference(operand);
    }
  }

  private checkClassReference(classIdentifier: Identifier): void {
    const name = classIdentifier.name;
    const classSymbol = this.symbolTable.lookupClass(name);

    if (!classSymbol) {
      const error = new SemanticError(
        `Class: ${name} is not declared`,
        classIdentifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
    }
  }

  private checkMapReference(mapIdentifier: Identifier): void {
    const name = mapIdentifier.name;
    const mapSymbol = this.symbolTable.lookupMap(name);

    if (!mapSymbol) {
      const error = new SemanticError(
        `Map: ${name} is not declared`,
        mapIdentifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
    }
  }

  private checkIdentifierReference(identifier: Identifier): void {
    const name = identifier.name;
    const location = identifier.startToken?.location;
    const symbol = this.symbolTable.lookupVariable(name);

    if (!symbol) {
      const classMembers = this.symbolTable.lookupClassMember(name);

      if (classMembers && (classMembers.length > 0)) {
        return;
      }

      const classSymbol = this.symbolTable.lookupClass(name);
      const mapSymbol = this.symbolTable.lookupMap(name);

      if (!classSymbol && !mapSymbol) {
        const error = new SemanticError(
          `Identifier: ${name} is not declared`,
          location,
        );

        if (this.strict) {
          throw error;
        }

        this.semanticErrors.push(error);
      }
    }
  }
}
