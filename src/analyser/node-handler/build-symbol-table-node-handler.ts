import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { SemanticError } from "../../scanner-error.ts";
import type { Symbol } from "../symbol.ts";
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
import {
  InternalScannerError,
  SemanticError as SemanticErrorClass,
} from "../../scanner-error.ts";
import { SymbolKind } from "../enum/symbol-kind.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import type { SymbolAttributes } from "../symbol.ts";
import {
  getElementaryTypeKind,
  getRequiredElementaryType,
  getRequiredIdentifier,
  getRequiredToken,
  getStringVariableKind,
} from "../util/symbol-table-utils.ts";
import { isElementaryType, isIdentifier } from "../../ast/util/types.ts";

export class BuildSymbolTableNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];
  public readonly symbolTable: SymbolTable = new SymbolTable();

  constructor(strict: boolean) {
    super(strict);
  }

  doBeforeVisit(node: AbstractCompositeNode): void {
    const nodeKind = node.nodeKind;

    switch (nodeKind) {
      case NodeKind.STATEMENT:
        this.handleStatementBeforeVisit(node as AbstractStatement);
        break;
      case NodeKind.PARAMETER:
        this.handleParameter(node as Parameter);
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
      case NodeKind.LENGTH_ATTRIBUTE:
      case NodeKind.MAP_ENTRY:
      case NodeKind.NUMBER_LITERAL:
      case NodeKind.PARAMETER_LIST:
      case NodeKind.PARAMETER_VALUE_LIST:
      case NodeKind.SPECIFICATION:
      case NodeKind.STRING_LITERAL:
      case NodeKind.TOKEN:
        // These nodes are handled as part of statements
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
      case NodeKind.LENGTH_ATTRIBUTE:
      case NodeKind.MAP_ENTRY:
      case NodeKind.NUMBER_LITERAL:
      case NodeKind.PARAMETER:
      case NodeKind.PARAMETER_LIST:
      case NodeKind.PARAMETER_VALUE_LIST:
      case NodeKind.SPECIFICATION:
      case NodeKind.STRING_LITERAL:
      case NodeKind.TOKEN:
        // These nodes are handled as part of statements
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
        this.symbolTable.enterScope(StatementKind[statementKind]);
        break;
      case StatementKind.EXPRESSION:
        // No action needed before visiting expression statements
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
      case StatementKind.IF:
      case StatementKind.WHILE:
      case StatementKind.DO:
      case StatementKind.SWITCH:
        this.symbolTable.exitScope();
        break;
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

  private defineSymbol(symbol: Symbol) {
    const success = this.symbolTable.define(symbol);

    if (!success) {
      const error = new SemanticErrorClass(
        `Variable: '${symbol.name}' is already declared in scope: ${this.symbolTable.getCurrentScope().name}`,
        symbol.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
    }
  }

  private defineGlobalSymbol(symbol: Symbol) {
    const success = this.symbolTable.defineGlobal(symbol);

    if (!success) {
      const error = new SemanticErrorClass(
        `Variable: '${symbol.name}' is already declared in global scope`,
        symbol.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
    }
  }

  private handleElementaryTypeDefinition(
    elementaryTypeDefinition: ElementaryTypeDefinition,
  ): void {
    const identifier = getRequiredIdentifier(
      elementaryTypeDefinition.identifier,
      elementaryTypeDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const elementaryType = getRequiredElementaryType(
      elementaryTypeDefinition.elementaryType,
      elementaryTypeDefinition,
      this.strict,
    );

    if (!elementaryType) {
      return;
    }

    const elementaryTypeKind = getElementaryTypeKind(
      elementaryType,
      this.strict,
    );

    if (elementaryTypeKind === undefined) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      isConst: !!elementaryTypeDefinition.constKeyword,
      elementaryTypeKind,
    };

    this.defineSymbol({
      node: elementaryTypeDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleComputedElementaryTypeDefinition(
    computedElementaryTypeDefinition: ComputedElementaryTypeDefinition,
  ): void {
    const identifier = getRequiredIdentifier(
      computedElementaryTypeDefinition.identifier,
      computedElementaryTypeDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const elementaryType = getRequiredElementaryType(
      computedElementaryTypeDefinition.elementaryType,
      computedElementaryTypeDefinition,
      this.strict,
    );

    if (!elementaryType) {
      return;
    }

    const elementaryTypeKind = getElementaryTypeKind(
      elementaryType,
      this.strict,
    );

    if (elementaryTypeKind === undefined) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      isConst: !!computedElementaryTypeDefinition.constKeyword,
      elementaryTypeKind,
      isComputed: true,
    };

    this.defineSymbol({
      node: computedElementaryTypeDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleArrayDefinition(arrayDefinition: ArrayDefinition): void {
    const identifier = getRequiredIdentifier(
      arrayDefinition.identifier,
      arrayDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      isArray: true,
    };

    if (isElementaryType(arrayDefinition.elementaryType)) {
      const elementaryTypeKind = getElementaryTypeKind(
        arrayDefinition.elementaryType,
        this.strict,
      );

      if (elementaryTypeKind) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(arrayDefinition.classIdentifier)) {
      attributes.classReference = arrayDefinition.classIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (!attributes.elementaryTypeKind && !attributes.classReference) {
      const error = new SemanticErrorClass(
        `Array definition must have either an elementary type or a class identifier`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
      return;
    }

    this.defineSymbol({
      node: arrayDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleComputedArrayDefinition(
    computedArrayDefinition: ComputedArrayDefinition,
  ): void {
    const identifier = getRequiredIdentifier(
      computedArrayDefinition.identifier,
      computedArrayDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const elementaryType = getRequiredElementaryType(
      computedArrayDefinition.elementaryType,
      computedArrayDefinition,
      this.strict,
    );

    if (!elementaryType) {
      return;
    }

    const elementaryTypeKind = getElementaryTypeKind(
      elementaryType,
      this.strict,
    );

    if (elementaryTypeKind === undefined) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      isArray: true,
      elementaryTypeKind,
    };

    this.defineSymbol({
      node: computedArrayDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleStringDefinition(stringDefinition: StringDefinition): void {
    const identifier = getRequiredIdentifier(
      stringDefinition.identifier,
      stringDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const stringVariableKindToken = getRequiredToken(
      stringDefinition.stringVariableKindToken,
      stringDefinition,
      this.strict,
    );

    if (!stringVariableKindToken) {
      return;
    }

    const stringVariableKind = getStringVariableKind(
      stringVariableKindToken,
      this.strict,
    );

    if (!stringVariableKind) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      isString: true,
      isConst: !!stringDefinition.constKeyword,
      stringVariableKind,
    };

    this.defineSymbol({
      node: stringDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
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

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {};

    this.defineGlobalSymbol({
      node: classDeclaration,
      name,
      kind: SymbolKind.CLASS,
      attributes,
      location,
    });

    this.symbolTable.enterScope(name);
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

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {};

    if (isElementaryType(mapDeclaration.outputElementaryType)) {
      const elementaryTypeKind = getElementaryTypeKind(
        mapDeclaration.outputElementaryType,
        this.strict,
      );

      if (elementaryTypeKind) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(mapDeclaration.outputClassIdentifier)) {
      attributes.classReference = mapDeclaration.outputClassIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (!attributes.elementaryTypeKind && !attributes.classReference) {
      const error = new SemanticErrorClass(
        `Map declaration must have either an elementary type or a class identifier`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
      return;
    }

    this.defineGlobalSymbol({
      node: mapDeclaration,
      name,
      kind: SymbolKind.MAP,
      attributes,
      location,
    });

    this.symbolTable.enterScope(name);
  }

  private handleClassDefinition(classDefinition: ClassDefinition): void {
    const identifier = getRequiredIdentifier(
      classDefinition.identifier,
      classDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const classIdentifier = getRequiredIdentifier(
      classDefinition.classIdentifier,
      classDefinition,
      this.strict,
    );

    if (!classIdentifier) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      classReference: classIdentifier.name,
    };

    this.defineSymbol({
      node: classDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleMapDefinition(mapDefinition: MapDefinition): void {
    const identifier = getRequiredIdentifier(
      mapDefinition.identifier,
      mapDefinition,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const mapIdentifier = getRequiredIdentifier(
      mapDefinition.mapIdentifier,
      mapDefinition,
      this.strict,
    );

    if (!mapIdentifier) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {
      mapReference: mapIdentifier.name,
    };

    if (isElementaryType(mapDefinition.elementaryType)) {
      const elementaryTypeKind = getElementaryTypeKind(
        mapDefinition.elementaryType,
        this.strict,
      );

      if (elementaryTypeKind) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(mapDefinition.classIdentifier)) {
      attributes.classReference = mapDefinition.classIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (!attributes.elementaryTypeKind && !attributes.classReference) {
      const error = new SemanticErrorClass(
        `Map definition must have either an elementary type or a class identifier`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
      return;
    }

    this.defineSymbol({
      node: mapDefinition,
      name,
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleParameter(parameter: Parameter): void {
    const identifier = getRequiredIdentifier(
      parameter.identifier,
      parameter,
      this.strict,
    );

    if (!identifier) {
      return;
    }

    const name = identifier.name;
    const location = identifier.startToken!.location;
    const attributes: SymbolAttributes = {};

    if (isElementaryType(parameter.elementaryType)) {
      const elementaryTypeKind = getElementaryTypeKind(
        parameter.elementaryType,
        this.strict,
      );

      if (elementaryTypeKind) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(parameter.classIdentifier)) {
      attributes.classReference = parameter.classIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (!attributes.elementaryTypeKind && !attributes.classReference) {
      const error = new SemanticErrorClass(
        `Parameter must have either an elementary type or a class identifier`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
      return;
    }

    this.defineSymbol({
      node: parameter,
      name,
      kind: SymbolKind.PARAMETER,
      attributes,
      location,
    });
  }

  private handleForStatementBefore(_forStatement: ForStatement): void {
    this.symbolTable.enterScope("FOR");

    // TODO: implement loop variable symbol definition
    // if (forStatement.computedElementaryDefinition) {
    //   const compElemDef = forStatement.computedElementaryDefinition;
    //   const identifier = compElemDef.identifier;

    // const name = identifier.name;
    // const location = identifier.startToken!.location;

    //     const symbolAttributes: SymbolAttributes = {
    //       isComputed: true,
    //     };

    //     if (isElementaryType(compElemDef.elementaryType)) {
    //       symbolAttributes.elementaryType = compElemDef.elementaryType;
    //     }

    // this.defineSymbol({
    //       node: forStatement,
    //       name,
    //       kind: SymbolKind.LOOP_VARIABLE,
    //       attributes: symbolAttributes,
    //       location,
    //     });
    //   }
  }
}
