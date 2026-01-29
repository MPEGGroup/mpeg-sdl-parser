import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { SemanticError } from "../../scanner-error.ts";
import type { SymbolTable } from "../symbol-table.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { ElementaryTypeDefinition } from "../../ast/node/elementary-type-definition.ts";
import type { ComputedElementaryTypeDefinition } from "../../ast/node/computed-elementary-type-definition.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import type { Token } from "../../ast/node/token.ts";
import { SemanticError as SemanticErrorClass } from "../../scanner-error.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";

// TODO: move to types
function isIdentifier(node: unknown): node is Identifier {
  return node !== null &&
    typeof node === "object" &&
    "nodeKind" in node &&
    (node as { nodeKind: NodeKind }).nodeKind === NodeKind.IDENTIFIER;
}

// TODO: move to types
function isToken(node: unknown): node is Token {
  return node !== null &&
    typeof node === "object" &&
    "nodeKind" in node &&
    (node as { nodeKind: NodeKind }).nodeKind === NodeKind.TOKEN;
}

export class ValidateTypeNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];
  private scopeStack: string[] = [];

  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(strict);
  }

  doBeforeVisit(node: AbstractCompositeNode): void {
    if (node.nodeKind === NodeKind.STATEMENT) {
      const statement = node as AbstractStatement;
      this.handleStatementBeforeVisit(statement);
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
        this.scopeStack.push("MAP");
        break;
      case StatementKind.ELEMENTARY_TYPE_DEFINITION:
        this.validateElementaryTypeDefinition(
          statement as ElementaryTypeDefinition,
        );
        break;
      case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
        this.validateComputedElementaryTypeDefinition(
          statement as ComputedElementaryTypeDefinition,
        );
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

  private validateElementaryTypeDefinition(
    elemTypeDef: ElementaryTypeDefinition,
  ): void {
    const identifier = elemTypeDef.identifier;
    if (elemTypeDef.constKeyword && !elemTypeDef.value) {
      if (isIdentifier(identifier)) {
        const location = identifier.startToken?.location;
        this.semanticErrors.push(
          new SemanticErrorClass(
            `Const variable '${identifier.name}' must have an initial value`,
            location,
          ),
        );
      }
    }

    // TODO: Validate that the assigned value type matches the elementary type
    // This requires type inference from expressions
  }

  private validateComputedElementaryTypeDefinition(
    _compElemTypeDef: ComputedElementaryTypeDefinition,
  ): void {
    // TODO: Validate computed type definitions
    // Computed variables have specific constraints
  }

  private validateExpression(expression: AbstractExpression): void {
    switch (expression.expressionKind) {
      case ExpressionKind.BINARY:
        this.validateBinaryExpression(expression as BinaryExpression);
        break;
      case ExpressionKind.UNARY:
        this.validateUnaryExpression(expression as UnaryExpression);
        break;
    }
  }

  private validateBinaryExpression(binaryExpr: BinaryExpression): void {
    const operator = binaryExpr.binaryOperator;
    if (!isToken(operator)) {
      return;
    }

    if (operator.tokenKind === TokenKind.ASSIGNMENT) {
      this.validateAssignment(binaryExpr);
    }

    // TODO: Add type compatibility checks for arithmetic, logical, and bitwise operators
    // This requires type inference from both operands
  }

  private validateAssignment(binaryExpr: BinaryExpression): void {
    const leftOperand = binaryExpr.leftOperand;
    if (!leftOperand) {
      return;
    }

    if (isIdentifier(leftOperand)) {
      const symbol = this.symbolTable.lookup(leftOperand.name);

      if (symbol) {
        if (symbol.attributes?.isConst) {
          const location = leftOperand.startToken?.location;
          this.semanticErrors.push(
            new SemanticErrorClass(
              `Cannot assign to const variable '${leftOperand.name}'`,
              location,
            ),
          );
        }
      }
    }

    // TODO: Validate that the right operand type is compatible with the left operand type
    // This requires type inference from both operands
  }

  private validateUnaryExpression(unaryExpr: UnaryExpression): void {
    const operand = unaryExpr.operand;
    if (!operand) {
      return;
    }

    if (unaryExpr.postfixOperator && isIdentifier(operand)) {
      const symbol = this.symbolTable.lookup(operand.name);

      if (symbol?.attributes?.isConst) {
        const location = operand.startToken?.location;
        this.semanticErrors.push(
          new SemanticErrorClass(
            `Cannot modify const variable '${operand.name}' with postfix operator`,
            location,
          ),
        );
      }
    }

    // TODO: Add type checks for unary operators (e.g., negation requires numeric type)
  }
}
