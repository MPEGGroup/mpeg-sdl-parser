import type { SymbolTable } from "../symbol-table.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { ExpressionKind } from "../../ast/node/enum/expression-kind.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { ClassDefinition } from "../../ast/node/class-definition.ts";
import type { MapDefinition } from "../../ast/node/map-definition.ts";
import type { ArrayDefinition } from "../../ast/node/array-definition.ts";
import type { ExtendsModifier } from "../../ast/node/extends-modifier.ts";
import type { UnaryExpression } from "../../ast/node/unary-expression.ts";
import type { BinaryExpression } from "../../ast/node/binary-expression.ts";
import type { LengthofExpression } from "../../ast/node/length-of-expression.ts";
import { SemanticError } from "../../scanner-error.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import {
  getRequiredIdentifier,
  getRequiredOperand,
} from "../util/symbol-table-utils.ts";
import { isIdentifier } from "../../ast/util/types.ts";
import type { MapDeclaration } from "../../ast/node/map-declaration.ts";

export class ValidateScopeNodeHandler extends AbstractAnalysisNodeHandler {
  constructor(public readonly symbolTable: SymbolTable, strict: boolean) {
    super(symbolTable, strict);

    this.registerBeforeNodeHandler(
      NodeKind.EXTENDS_MODIFIER,
      undefined,
      (node) => this.validateExtendsModifier(node as ExtendsModifier),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.UNARY,
      (node) => this.validateUnaryExpression(node as UnaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.BINARY,
      (node) => this.validateBinaryExpression(node as BinaryExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.EXPRESSION,
      ExpressionKind.LENGTHOF,
      (node) => this.validateLengthofExpression(node as LengthofExpression),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DECLARATION,
      (node) => this.handleMapDeclaration(node as MapDeclaration),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.CLASS_DEFINITION,
      (node) => this.validateClassDefinition(node as ClassDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DEFINITION,
      (node) => this.validateMapDefinition(node as MapDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.ARRAY_DEFINITION,
      (node) => this.validateArrayDefinition(node as ArrayDefinition),
    );
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

  private validateUnaryExpression(unaryExpression: UnaryExpression): void {
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

  private validateBinaryExpression(binaryExpression: BinaryExpression): void {
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

  private validateLengthofExpression(
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
        classIdentifier.startToken!.getLocation(),
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
        mapIdentifier.startToken!.getLocation(),
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
    }
  }

  private checkIdentifierReference(identifier: Identifier): void {
    const name = identifier.name;
    const location = identifier.startToken?.getLocation();
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
