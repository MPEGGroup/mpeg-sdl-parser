import {
  AddSymbolResult,
  type Symbol,
  type SymbolAttributes,
  SymbolKind,
  SymbolTable,
} from "../symbol-table.ts";
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
import { SemanticError } from "../../scanner-error.ts";
import { AbstractAnalysisNodeHandler } from "./abstract-analysis-node-handler.ts";
import {
  getElementaryTypeKind,
  getRequiredElementaryType,
  getRequiredIdentifier,
  getRequiredToken,
  getStringVariableKind,
} from "../util/symbol-table-utils.ts";
import {
  isElementaryType,
  isExpandableModifier,
  isIdentifier,
} from "../../ast/util/types.ts";
import { ElementaryTypeKind } from "../../ast/node/enum/elementary-type-kind.ts";

export class BuildSymbolTableNodeHandler extends AbstractAnalysisNodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];

  constructor(symbolTable: SymbolTable, strict: boolean) {
    super(symbolTable, strict);

    this.registerBeforeNodeHandler(
      NodeKind.PARAMETER,
      undefined,
      (node) => this.handleParameter(node as Parameter),
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
      StatementKind.ELEMENTARY_TYPE_DEFINITION,
      (node) =>
        this.handleElementaryTypeDefinition(node as ElementaryTypeDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION,
      (node) =>
        this.handleComputedElementaryTypeDefinition(
          node as ComputedElementaryTypeDefinition,
        ),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.ARRAY_DEFINITION,
      (node) => this.handleArrayDefinition(node as ArrayDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPUTED_ARRAY_DEFINITION,
      (node) =>
        this.handleComputedArrayDefinition(node as ComputedArrayDefinition),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.STRING_DEFINITION,
      (node) => this.handleStringDefinition(node as StringDefinition),
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
      StatementKind.FOR,
      (node) => this.handleForStatement(node as ForStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPOUND,
      () =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.COMPOUND]),
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
      StatementKind.SWITCH,
      () =>
        this.symbolTable.enterBlockScope(StatementKind[StatementKind.SWITCH]),
    );
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.COMPOUND,
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
      StatementKind.SWITCH,
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
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      () => this.symbolTable.exitScope(),
    );
  }

  private defineSymbol(symbol: Symbol) {
    const addSymbolResult = this.symbolTable.addSymbol(symbol);

    if (addSymbolResult === AddSymbolResult.SUCCESS) {
      return;
    }

    let error: SemanticError | undefined;

    if (addSymbolResult === AddSymbolResult.DUPLICATE) {
      error = new SemanticError(
        `Variable: ${symbol.name} is already declared in scope: ${this.symbolTable.getCurrentScope().name}`,
        symbol.location,
      );
    } else if (addSymbolResult === AddSymbolResult.MEMBER_CONFLICT) {
      const classScope = this.symbolTable.getEnclosingClassScope();

      error = new SemanticError(
        `Duplicate member variable: ${symbol.name} conflicts with type defined in different conditional branch within scope: ${
          classScope!.name
        }`,
        symbol.location,
      );
    }

    if (this.strict) {
      throw error;
    }

    this.semanticErrors.push(error!);
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

      if (elementaryTypeKind !== undefined) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(arrayDefinition.classIdentifier)) {
      attributes.classReference = arrayDefinition.classIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (
      (attributes.elementaryTypeKind === undefined) &&
      !attributes.classReference
    ) {
      const error = new SemanticError(
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
      isComputed: true,
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

    if (stringVariableKind === undefined) {
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

    this.defineSymbol({
      node: classDeclaration,
      name,
      kind: SymbolKind.CLASS,
      attributes,
      location,
    });

    this.symbolTable.enterClassScope(name);

    if (isExpandableModifier(classDeclaration.expandableModifier)) {
      const sizeOfInstanceLocation =
        classDeclaration.expandableModifier!.startToken!.location;

      const sizeOfInstanceAttributes: SymbolAttributes = {
        isComputed: true,
        isConst: true,
        elementaryTypeKind: ElementaryTypeKind.UNSIGNED_INTEGER,
      };

      this.defineSymbol({
        node: classDeclaration.expandableModifier!,
        name: "sizeOfInstance",
        kind: SymbolKind.VARIABLE,
        attributes: sizeOfInstanceAttributes,
        location: sizeOfInstanceLocation,
      });
    }
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

      if (elementaryTypeKind !== undefined) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(mapDeclaration.outputClassIdentifier)) {
      attributes.classReference = mapDeclaration.outputClassIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (
      (attributes.elementaryTypeKind === undefined) &&
      !attributes.classReference
    ) {
      const error = new SemanticError(
        `Map declaration must have either an elementary type or a class identifier`,
        identifier.startToken!.location,
      );

      if (this.strict) {
        throw error;
      }

      this.semanticErrors.push(error);
      return;
    }

    this.defineSymbol({
      node: mapDeclaration,
      name,
      kind: SymbolKind.MAP,
      attributes,
      location,
    });

    this.symbolTable.enterMapScope(name);
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

      if (elementaryTypeKind !== undefined) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(mapDefinition.classIdentifier)) {
      attributes.classReference = mapDefinition.classIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (!attributes.elementaryTypeKind && !attributes.classReference) {
      const error = new SemanticError(
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

      if (elementaryTypeKind !== undefined) {
        attributes.elementaryTypeKind = elementaryTypeKind;
      }
    } else if (isIdentifier(parameter.classIdentifier)) {
      attributes.classReference = parameter.classIdentifier.name;
    }

    // check that at least one of elementaryType or classIdentifier is present
    if (
      (attributes.elementaryTypeKind === undefined) &&
      !attributes.classReference
    ) {
      const error = new SemanticError(
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
      kind: SymbolKind.VARIABLE,
      attributes,
      location,
    });
  }

  private handleForStatement(_forStatement: ForStatement): void {
    this.symbolTable.enterBlockScope(StatementKind[StatementKind.FOR]);
  }
}
