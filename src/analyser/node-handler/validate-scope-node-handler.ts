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
import {
  InternalScannerError,
  SemanticError as SemanticErrorClass,
} from "../../scanner-error.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import type { MapDeclaration } from "../../../dist/index.js";
import {
  getRequiredIdentifier,
  getRequiredOperand,
} from "../util/symbol-table-utils.ts";
import { isIdentifier } from "../../ast/util/types.ts";

export class ValidateScopeNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];
  private scopeStack: string[] = [];

  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(strict);
  }

  doBeforeVisit(node: AbstractCompositeNode): void {
    const nodeKind = node.nodeKind;

    switch (nodeKind) {
      case NodeKind.STATEMENT:
        this.handleStatementBeforeVisit(node as AbstractStatement);
        break;
      case NodeKind.EXTENDS_MODIFIER:
        this.validateExtendsModifier(node as ExtendsModifier);
        break;
      case NodeKind.EXPRESSION:
        this.validateExpression(node as AbstractExpression);
        break;
      case NodeKind.CLASS_MEMBER_ACCESS:
      case NodeKind.ARRAY_ELEMENT_ACCESS:
      case NodeKind.ARRAY_DIMENSION:
      case NodeKind.PARAMETER_VALUE_LIST:
        break;
      case NodeKind.EXPANDABLE_MODIFIER:
      case NodeKind.PARAMETER:
      case NodeKind.UNEXPECTED_ERROR:
      case NodeKind.AGGREGATE_OUTPUT_VALUE:
      case NodeKind.ALIGNED_MODIFIER:
      case NodeKind.BIT_MODIFIER:
      case NodeKind.CASE_CLAUSE:
      case NodeKind.CLASS_ID:
      case NodeKind.DEFAULT_CLAUSE:
      case NodeKind.ELEMENTARY_TYPE:
      case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
      case NodeKind.IDENTIFIER:
      case NodeKind.LENGTH_ATTRIBUTE:
      case NodeKind.MAP_ENTRY:
      case NodeKind.NUMBER_LITERAL:
      case NodeKind.PARAMETER_LIST:
      case NodeKind.SPECIFICATION:
      case NodeKind.STRING_LITERAL:
      case NodeKind.TOKEN:
        break;
      default: {
        const exhaustiveCheck: never = nodeKind;
        throw new InternalScannerError(
          "Unreachable code reached, nodeKind == " + exhaustiveCheck,
        );
      }
    }
  }

  doVisit(_node: AbstractLeafNode): void {
    // Leaf nodes don't define symbols
  }

  doAfterVisit(node: AbstractCompositeNode): void {
    const nodeKind = node.nodeKind;

    switch (nodeKind) {
      case NodeKind.STATEMENT:
        this.handleStatementAfterVisit(node as AbstractStatement);
        break;
      case NodeKind.LENGTH_ATTRIBUTE:
        break;
      case NodeKind.UNEXPECTED_ERROR:
      case NodeKind.AGGREGATE_OUTPUT_VALUE:
      case NodeKind.ALIGNED_MODIFIER:
      case NodeKind.ARRAY_DIMENSION:
      case NodeKind.ARRAY_ELEMENT_ACCESS:
      case NodeKind.BIT_MODIFIER:
      case NodeKind.CASE_CLAUSE:
      case NodeKind.CLASS_ID:
      case NodeKind.CLASS_MEMBER_ACCESS:
      case NodeKind.DEFAULT_CLAUSE:
      case NodeKind.ELEMENTARY_TYPE:
      case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
      case NodeKind.EXPANDABLE_MODIFIER:
      case NodeKind.EXPRESSION:
      case NodeKind.EXTENDS_MODIFIER:
      case NodeKind.IDENTIFIER:
      case NodeKind.MAP_ENTRY:
      case NodeKind.NUMBER_LITERAL:
      case NodeKind.PARAMETER:
      case NodeKind.PARAMETER_LIST:
      case NodeKind.PARAMETER_VALUE_LIST:
      case NodeKind.SPECIFICATION:
      case NodeKind.STRING_LITERAL:
      case NodeKind.TOKEN:
        break;
      default: {
        const exhaustiveCheck: never = nodeKind;
        throw new InternalScannerError(
          "Unreachable code reached, nodeKind == " + exhaustiveCheck,
        );
      }
    }
  }

  private handleStatementBeforeVisit(statement: AbstractStatement): void {
    const statementKind = statement.statementKind;

    switch (statementKind) {
      case StatementKind.CLASS_DECLARATION:
        this.enterClassScope(statement as ClassDeclaration);
        break;
      case StatementKind.MAP_DECLARATION:
        this.enterMapScope(statement as MapDeclaration);
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
      case StatementKind.ELEMENTARY_TYPE_DEFINITION:
      case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
        break;
      case StatementKind.SWITCH:
      case StatementKind.WHILE:
      case StatementKind.DO:
      case StatementKind.FOR:
      case StatementKind.COMPOUND:
        this.scopeStack.push(StatementKind[statementKind]);
        break;
      case StatementKind.IF:
      case StatementKind.EXPRESSION:
        break;
      case StatementKind.COMPUTED_ARRAY_DEFINITION:
      case StatementKind.STRING_DEFINITION:
        break;
      default: {
        const exhaustiveCheck: never = statementKind;
        throw new InternalScannerError(
          "Unreachable code reached, statementKind == " + exhaustiveCheck,
        );
      }
    }
  }

  private handleStatementAfterVisit(statement: AbstractStatement): void {
    const statementKind = statement.statementKind;

    switch (statementKind) {
      case StatementKind.CLASS_DECLARATION:
      case StatementKind.MAP_DECLARATION:
      case StatementKind.FOR:
      case StatementKind.COMPOUND:
      case StatementKind.WHILE:
      case StatementKind.DO:
      case StatementKind.SWITCH:
        this.scopeStack.pop();
        break;
      case StatementKind.IF:
      case StatementKind.ELEMENTARY_TYPE_DEFINITION:
      case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
      case StatementKind.ARRAY_DEFINITION:
      case StatementKind.COMPUTED_ARRAY_DEFINITION:
      case StatementKind.STRING_DEFINITION:
      case StatementKind.CLASS_DEFINITION:
      case StatementKind.MAP_DEFINITION:
      case StatementKind.EXPRESSION:
        // No action needed after visiting these statements
        break;
      default: {
        const exhaustiveCheck: never = statementKind;
        throw new InternalScannerError(
          "Unreachable code reached, statementKind == " + exhaustiveCheck,
        );
      }
    }
  }

  private enterClassScope(classDeclaration: ClassDeclaration): void {
    const identifier = getRequiredIdentifier(
      classDeclaration.identifier,
      classDeclaration,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    this.scopeStack.push(identifier.name);
  }

  private enterMapScope(mapDeclaration: MapDeclaration): void {
    const identifier = getRequiredIdentifier(
      mapDeclaration.identifier,
      mapDeclaration,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    this.scopeStack.push(identifier.name);
  }

  private checkClassReference(classIdentifier: Identifier): void {
    const name = classIdentifier.name;
    const classSymbol = this.symbolTable.lookupClass(name);

    if (!classSymbol) {
      const error = new SemanticErrorClass(
        `Class '${name}' is not declared`,
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
      const error = new SemanticErrorClass(
        `Map '${name}' is not declared`,
        mapIdentifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
    }
  }

  private validateClassDefinition(classDefinition: ClassDefinition): void {
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

  private validateMapDefinition(mapDefinition: MapDefinition): void {
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

  private validateArrayDefinition(arrayDefinition: ArrayDefinition): void {
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

  private validateExtendsModifier(extendsModifier: ExtendsModifier): void {
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

  private validateExpression(expression: AbstractExpression): void {
    const expressionKind = expression.expressionKind;

    switch (expressionKind) {
      case ExpressionKind.UNARY:
        this.validateUnaryExpression(expression as UnaryExpression);
        break;
      case ExpressionKind.BINARY:
        this.validateBinaryExpression(expression as BinaryExpression);
        break;
      case ExpressionKind.LENGTHOF:
        this.validateLengthofExpression(expression as LengthofExpression);
        break;
      default: {
        const exhaustiveCheck: never = expressionKind;
        throw new InternalScannerError(
          "Unreachable code reached, expressionKind == " + exhaustiveCheck,
        );
      }
    }
  }

  private validateUnaryExpression(unaryExpr: UnaryExpression): void {
    const operand = getRequiredOperand(
      unaryExpr.operand,
      unaryExpr,
      this.strict,
    );

    if (!operand) {
      return;
    }

    if (isIdentifier(operand)) {
      this.validateIdentifierReference(operand);
    }

    // Nested expressions will be visited recursively by the traversal
  }

  private validateBinaryExpression(binaryExpr: BinaryExpression): void {
    const leftOperand = getRequiredOperand(
      binaryExpr.leftOperand,
      binaryExpr,
      this.strict,
    );
    const rightOperand = getRequiredOperand(
      binaryExpr.rightOperand,
      binaryExpr,
      this.strict,
    );

    if (isIdentifier(leftOperand)) {
      this.validateIdentifierReference(leftOperand);
    }

    if (isIdentifier(rightOperand)) {
      this.validateIdentifierReference(rightOperand);
    }

    // Nested expressions will be visited recursively by the traversal
  }

  private validateLengthofExpression(lengthofExpr: LengthofExpression): void {
    const operand = getRequiredOperand(
      lengthofExpr.operand,
      lengthofExpr,
      this.strict,
    );

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
