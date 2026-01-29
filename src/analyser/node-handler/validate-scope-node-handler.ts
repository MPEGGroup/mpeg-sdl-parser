import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { SemanticError } from "../../scanner-error.ts";
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
import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { LengthofExpression } from "../../ast/node/length-of-expression.ts";
import { SemanticError as SemanticErrorClass } from "../../scanner-error.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";

// TODO: move to types
function isIdentifier(node: unknown): node is Identifier {
  return node !== null &&
    typeof node === "object" &&
    "nodeKind" in node &&
    (node as { nodeKind: NodeKind }).nodeKind === NodeKind.IDENTIFIER;
}

export class ValidateScopeNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];
  private scopeStack: string[] = [];

  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(strict);
  }

  doBeforeVisit(node: AbstractCompositeNode): void {
    if (node.nodeKind === NodeKind.STATEMENT) {
      const statement = node as AbstractStatement;
      this.handleStatementBeforeVisit(statement);
    } else if (node.nodeKind === NodeKind.EXTENDS_MODIFIER) {
      this.validateExtendsModifier(node as ExtendsModifier);
    } else if (node.nodeKind === NodeKind.EXPRESSION) {
      this.validateExpression(node as AbstractExpression);
    }
  }

  doVisit(_node: AbstractLeafNode): void {
    // Leaf nodes are validated in the context of their parent composite nodes
  }

  doAfterVisit(node: AbstractCompositeNode): void {
    if (node.nodeKind === NodeKind.STATEMENT) {
      const statement = node as AbstractStatement;
      this.handleStatementAfterVisit(statement);
    }
  }

  private handleStatementBeforeVisit(statement: AbstractStatement): void {
    switch (statement.statementKind) {
      case StatementKind.CLASS_DECLARATION:
        this.enterClassScope(statement as ClassDeclaration);
        break;
      case StatementKind.MAP_DECLARATION:
        this.enterMapScope();
        break;
      case StatementKind.CLASS_DEFINITION:
        this.validateClassDefinition(statement as ClassDefinition);
        break;
      case StatementKind.MAP_DEFINITION:
        this.validateMapDefinition(statement as MapDefinition);
        break;
      case StatementKind.ARRAY_DEFINITION:
        this.validateArrayDefinition(statement as ArrayDefinition);
        break;
      case StatementKind.FOR:
      case StatementKind.COMPOUND:
      case StatementKind.IF:
      case StatementKind.WHILE:
      case StatementKind.DO:
      case StatementKind.SWITCH:
        this.scopeStack.push(StatementKind[statement.statementKind]);
        break;
    }
  }

  private handleStatementAfterVisit(statement: AbstractStatement): void {
    switch (statement.statementKind) {
      case StatementKind.CLASS_DECLARATION:
      case StatementKind.MAP_DECLARATION:
      case StatementKind.FOR:
      case StatementKind.COMPOUND:
      case StatementKind.IF:
      case StatementKind.WHILE:
      case StatementKind.DO:
      case StatementKind.SWITCH:
        this.scopeStack.pop();
        break;
    }
  }

  private enterClassScope(classDecl: ClassDeclaration): void {
    const identifier = classDecl.identifier;
    if (isIdentifier(identifier)) {
      this.scopeStack.push(identifier.name);
    }
  }

  private enterMapScope(): void {
    this.scopeStack.push("MAP");
  }

  private validateExtendsModifier(extendsModifier: ExtendsModifier): void {
    const identifier = extendsModifier.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const classSymbol = this.symbolTable.lookupClass(name);
    if (!classSymbol) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Extended class '${name}' is not declared`,
          location,
        ),
      );
    }
  }

  private validateClassDefinition(classDef: ClassDefinition): void {
    const classIdentifier = classDef.classIdentifier;
    if (!isIdentifier(classIdentifier)) {
      return;
    }

    const name = classIdentifier.name;
    const location = classIdentifier.startToken?.location;

    const classSymbol = this.symbolTable.lookupClass(name);
    if (!classSymbol) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Class '${name}' is not declared`,
          location,
        ),
      );
    }
  }

  private validateMapDefinition(mapDef: MapDefinition): void {
    const mapIdentifier = mapDef.mapIdentifier;
    if (!isIdentifier(mapIdentifier)) {
      return;
    }

    const name = mapIdentifier.name;
    const location = mapIdentifier.startToken?.location;

    const mapSymbol = this.symbolTable.lookupMap(name);
    if (!mapSymbol) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Map '${name}' is not declared`,
          location,
        ),
      );
    }

    if (isIdentifier(mapDef.classIdentifier)) {
      const className = mapDef.classIdentifier.name;
      const classLocation = mapDef.classIdentifier.startToken?.location;
      const classSymbol = this.symbolTable.lookupClass(className);
      if (!classSymbol) {
        this.semanticErrors.push(
          new SemanticErrorClass(
            `Class '${className}' is not declared`,
            classLocation,
          ),
        );
      }
    }
  }

  private validateArrayDefinition(arrayDef: ArrayDefinition): void {
    const classIdentifier = arrayDef.classIdentifier;
    if (!isIdentifier(classIdentifier)) {
      return;
    }

    const name = classIdentifier.name;
    const location = classIdentifier.startToken?.location;

    const classSymbol = this.symbolTable.lookupClass(name);
    if (!classSymbol) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Class '${name}' is not declared`,
          location,
        ),
      );
    }
  }

  private validateExpression(expression: AbstractExpression): void {
    switch (expression.expressionKind) {
      case ExpressionKind.UNARY:
        this.validateUnaryExpression(expression as UnaryExpression);
        break;
      case ExpressionKind.BINARY:
        this.validateBinaryExpression(expression as BinaryExpression);
        break;
      case ExpressionKind.LENGTHOF:
        this.validateLengthofExpression(expression as LengthofExpression);
        break;
    }
  }

  private validateUnaryExpression(unaryExpr: UnaryExpression): void {
    const operand = unaryExpr.operand;
    if (!operand) {
      return;
    }

    if (isIdentifier(operand)) {
      this.validateIdentifierReference(operand);
    }
    // Nested expressions will be visited recursively by the traversal
  }

  private validateBinaryExpression(binaryExpr: BinaryExpression): void {
    const leftOperand = binaryExpr.leftOperand;
    const rightOperand = binaryExpr.rightOperand;

    if (isIdentifier(leftOperand)) {
      this.validateIdentifierReference(leftOperand);
    }

    if (isIdentifier(rightOperand)) {
      this.validateIdentifierReference(rightOperand);
    }
    // Nested expressions will be visited recursively by the traversal
  }

  private validateLengthofExpression(lengthofExpr: LengthofExpression): void {
    const operand = lengthofExpr.operand;
    if (!operand) {
      return;
    }

    if (isIdentifier(operand)) {
      this.validateIdentifierReference(operand);
    }
  }

  private validateIdentifierReference(identifier: Identifier): void {
    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbol = this.symbolTable.lookup(name);
    if (!symbol) {
      const classSymbol = this.symbolTable.lookupClass(name);
      const mapSymbol = this.symbolTable.lookupMap(name);

      if (!classSymbol && !mapSymbol) {
        this.semanticErrors.push(
          new SemanticErrorClass(
            `Identifier '${name}' is not declared`,
            location,
          ),
        );
      }
    }
  }
}
