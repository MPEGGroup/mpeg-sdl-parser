import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { SemanticError } from "../../scanner-error.ts";
import { SymbolTable } from "../symbol-table.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import type { MapDeclaration } from "../../ast/node/map-declaration.ts";
import type { Parameter } from "../../ast/node/parameter.ts";
import type { ElementaryTypeDefinition } from "../../ast/node/elementary-type-definition.ts";
import type { ComputedElementaryTypeDefinition } from "../../ast/node/computed-elementary-type-definition.ts";
import type { ArrayDefinition } from "../../ast/node/array-definition.ts";
import type { ComputedArrayDefinition } from "../../ast/node/computed-array-definition.ts";
import type { StringDefinition } from "../../ast/node/string-definition.ts";
import type { ClassDefinition } from "../../ast/node/class-definition.ts";
import type { MapDefinition } from "../../ast/node/map-definition.ts";
import type { ForStatement } from "../../ast/node/for-statement.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { Identifier } from "../../ast/node/identifier.ts";
import type { ElementaryType } from "../../ast/node/elementary-type.ts";
import { SemanticError as SemanticErrorClass } from "../../scanner-error.ts";
import { SymbolKind } from "../enum/symbol-kind.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";

function isIdentifier(node: unknown): node is Identifier {
  return node !== null &&
    typeof node === "object" &&
    "nodeKind" in node &&
    (node as { nodeKind: NodeKind }).nodeKind === NodeKind.IDENTIFIER;
}

function isElementaryType(node: unknown): node is ElementaryType {
  return node !== null &&
    typeof node === "object" &&
    "nodeKind" in node &&
    (node as { nodeKind: NodeKind }).nodeKind === NodeKind.ELEMENTARY_TYPE;
}

export class BuildSymbolTableNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];
  public readonly symbolTable: SymbolTable = new SymbolTable();

  constructor(strictMode: boolean) {
    super(strictMode);
  }

  doBeforeVisit(node: AbstractCompositeNode): void {
    if (node.nodeKind === NodeKind.STATEMENT) {
      const statement = node as AbstractStatement;
      this.handleStatementBeforeVisit(statement);
    } else if (node.nodeKind === NodeKind.PARAMETER) {
      this.handleParameter(node as Parameter);
    }
  }

  doVisit(_node: AbstractLeafNode): void {
    // Leaf nodes don't define symbols
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
        this.handleClassDeclaration(statement as ClassDeclaration);
        break;
      case StatementKind.MAP_DECLARATION:
        this.handleMapDeclaration(statement as MapDeclaration);
        break;
      case StatementKind.ELEMENTARY_TYPE_DEFINITION:
        this.handleElementaryTypeDefinition(
          statement as ElementaryTypeDefinition,
        );
        break;
      case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
        this.handleComputedElementaryTypeDefinition(
          statement as ComputedElementaryTypeDefinition,
        );
        break;
      case StatementKind.ARRAY_DEFINITION:
        this.handleArrayDefinition(statement as ArrayDefinition);
        break;
      case StatementKind.COMPUTED_ARRAY_DEFINITION:
        this.handleComputedArrayDefinition(
          statement as ComputedArrayDefinition,
        );
        break;
      case StatementKind.STRING_DEFINITION:
        this.handleStringDefinition(statement as StringDefinition);
        break;
      case StatementKind.CLASS_DEFINITION:
        this.handleClassDefinition(statement as ClassDefinition);
        break;
      case StatementKind.MAP_DEFINITION:
        this.handleMapDefinition(statement as MapDefinition);
        break;
      case StatementKind.FOR:
        this.handleForStatementBefore(statement as ForStatement);
        break;
      case StatementKind.COMPOUND:
      case StatementKind.IF:
      case StatementKind.WHILE:
      case StatementKind.DO:
      case StatementKind.SWITCH:
        this.symbolTable.enterScope(StatementKind[statement.statementKind]);
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
        this.symbolTable.exitScope();
        break;
    }
  }

  private handleClassDeclaration(classDecl: ClassDeclaration): void {
    const identifier = classDecl.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const success = this.symbolTable.defineGlobal({
      name,
      kind: SymbolKind.CLASS,
      location,
      declarationNode: classDecl,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Class '${name}' is already declared`,
          location,
        ),
      );
    }

    this.symbolTable.enterScope(name);
  }

  private handleMapDeclaration(mapDecl: MapDeclaration): void {
    const identifier = mapDecl.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const success = this.symbolTable.defineGlobal({
      name,
      kind: SymbolKind.MAP,
      location,
      declarationNode: mapDecl,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Map '${name}' is already declared`,
          location,
        ),
      );
    }

    this.symbolTable.enterScope(name);
  }

  private handleParameter(param: Parameter): void {
    const identifier = param.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {};
    if (isElementaryType(param.elementaryType)) {
      symbolAttributes.elementaryType = param.elementaryType;
    } else if (isIdentifier(param.classIdentifier)) {
      symbolAttributes.classReference = param.classIdentifier.name;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.PARAMETER,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Parameter '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleElementaryTypeDefinition(
    elemTypeDef: ElementaryTypeDefinition,
  ): void {
    const identifier = elemTypeDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {
      isConst: !!elemTypeDef.constKeyword,
    };

    if (isElementaryType(elemTypeDef.elementaryType)) {
      symbolAttributes.elementaryType = elemTypeDef.elementaryType;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleComputedElementaryTypeDefinition(
    compElemTypeDef: ComputedElementaryTypeDefinition,
  ): void {
    const identifier = compElemTypeDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {
      isComputed: true,
      isConst: !!compElemTypeDef.constKeyword,
    };

    if (isElementaryType(compElemTypeDef.elementaryType)) {
      symbolAttributes.elementaryType = compElemTypeDef.elementaryType;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleArrayDefinition(arrayDef: ArrayDefinition): void {
    const identifier = arrayDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {
      isArray: true,
    };

    if (isElementaryType(arrayDef.elementaryType)) {
      symbolAttributes.elementaryType = arrayDef.elementaryType;
    } else if (isIdentifier(arrayDef.classIdentifier)) {
      symbolAttributes.classReference = arrayDef.classIdentifier.name;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleComputedArrayDefinition(
    compArrayDef: ComputedArrayDefinition,
  ): void {
    const identifier = compArrayDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {
      isArray: true,
      isComputed: true,
    };

    if (isElementaryType(compArrayDef.elementaryType)) {
      symbolAttributes.elementaryType = compArrayDef.elementaryType;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleStringDefinition(stringDef: StringDefinition): void {
    const identifier = stringDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {
      isConst: !!stringDef.constKeyword,
    };

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleClassDefinition(classDef: ClassDefinition): void {
    const identifier = classDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {};
    if (isIdentifier(classDef.classIdentifier)) {
      symbolAttributes.classReference = classDef.classIdentifier.name;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleMapDefinition(mapDef: MapDefinition): void {
    const identifier = mapDef.identifier;
    if (!isIdentifier(identifier)) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken?.location;

    const symbolAttributes: SymbolAttributes = {};
    if (isElementaryType(mapDef.elementaryType)) {
      symbolAttributes.elementaryType = mapDef.elementaryType;
    } else if (isIdentifier(mapDef.classIdentifier)) {
      symbolAttributes.classReference = mapDef.classIdentifier.name;
    }

    const success = this.symbolTable.define({
      name,
      kind: SymbolKind.VARIABLE,
      attributes: symbolAttributes,
      location,
    });

    if (!success) {
      this.semanticErrors.push(
        new SemanticErrorClass(
          `Variable '${name}' is already declared in this scope`,
          location,
        ),
      );
    }
  }

  private handleForStatementBefore(forStmt: ForStatement): void {
    this.symbolTable.enterScope("FOR");

    if (forStmt.computedElementaryDefinition) {
      const compElemDef = forStmt.computedElementaryDefinition;
      const identifier = compElemDef.identifier;
      if (isIdentifier(identifier)) {
        const name = identifier.name;
        const location = identifier.startToken?.location;

        const symbolAttributes: SymbolAttributes = {
          isComputed: true,
        };

        if (isElementaryType(compElemDef.elementaryType)) {
          symbolAttributes.elementaryType = compElemDef.elementaryType;
        }

        const success = this.symbolTable.define({
          name,
          kind: SymbolKind.LOOP_VARIABLE,
          attributes: symbolAttributes,
          location,
        });

        if (!success) {
          this.semanticErrors.push(
            new SemanticErrorClass(
              `Loop variable '${name}' is already declared in this scope`,
              location,
            ),
          );
        }
      }
    }
  }
}
