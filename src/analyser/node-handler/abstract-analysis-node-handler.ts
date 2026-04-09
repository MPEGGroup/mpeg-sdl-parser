import type { AbstractArrayDimension } from "../../ast/node/abstract-array-dimension.ts";
import type { AbstractClassId } from "../../ast/node/abstract-class-id.ts";
import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import type { ClassDeclaration } from "../../ast/node/class-declaration.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { ForStatement } from "../../ast/node/for-statement.ts";
import type { IfStatement } from "../../ast/node/if-statement.ts";
import type { MapDeclaration } from "../../ast/node/map-declaration.ts";
import type { SwitchStatement } from "../../ast/node/switch-statement.ts";
import type { Token } from "../../ast/node/token.ts";
import type { WhileStatement } from "../../ast/node/while-statement.ts";
import {
  isCaseClause,
  isDefaultClause,
  isStatement,
} from "../../ast/util/types.ts";
import type { NodeHandler } from "../../ast/visitor/node-handler.ts";
import { SemanticError, SemanticWarning } from "../../scanner-error.ts";
import getLogger from "../../util/logger.ts";
import type { SymbolTable } from "../symbol-table.ts";
import { getRequiredIdentifier } from "../util/symbol-table-utils.ts";

const logger = getLogger("AbstractAnalysisNodeHandler");

/**
 * This abstract class provides a base implementation for node handlers that analyze
 * abstract syntax tree (AST) nodes. It implements the `NodeHandler` interface and
 * provides default behaviour to handle error nodes and missing required values in
 * either strict or lenient mode.
 *
 * Handlers for specific node kinds (and optional sub-kinds) can be registered using the `registerBeforeNodeHandler`
 * and `registerAfterNodeHandler` methods, which will be called before and after visiting nodes of the specified kinds, respectively.
 *
 * In strict mode, encountering an unexpected error node or an error token will throw a `SemanticError`.
 * In lenient mode, these nodes will be ignored, and a debug message will be logged.
 *
 * Support for adding implicit block scopes for if, switch, while and for statements is implemented
 * by registering these nodes in implicitScopeNodes (if required) in implicitScopeNodes. The implicit scopes
 * are then entered and left within beforeVisit() and afterVisit().
 */
export abstract class AbstractAnalysisNodeHandler implements NodeHandler {
  public readonly semanticErrors: Array<SemanticError> = [];
  public readonly semanticWarnings: Array<SemanticWarning> = [];

  private handlersByNodeKind: Map<NodeKind, {
    beforeVisit?: ((node: AbstractCompositeNode) => void)[];
    afterVisit?: ((node: AbstractCompositeNode) => void)[];
  }> = new Map();

  private handlersByNodeKindAndSubKind: Map<string, {
    beforeVisit?: ((node: AbstractCompositeNode) => void)[];
    afterVisit?: ((node: AbstractCompositeNode) => void)[];
  }> = new Map();

  // Set of nodes that we encounter that should implicitly create a new scope
  // - if statements with non-compound bodies
  // - switch case clauses with non-compound bodies
  // - switch default clause with non-compound body
  // - while statements with non-compound bodies
  // - for statements with non-compound bodies
  private implicitScopeNodes: Set<AbstractCompositeNode> = new Set();

  private subKindKey(nodeKind: NodeKind, subKind: number): string {
    return `${nodeKind}:${subKind}`;
  }

  constructor(
    public readonly symbolTable: SymbolTable,
    public readonly strict: boolean,
  ) {
    // use our own beforeVisit and afterVisit implementations for node kinds with sub-kinds
    // to dispatch to any registered handlers based on node kind and sub-kind
    this.registerBeforeNodeHandler(NodeKind.STATEMENT, undefined, (node) => {
      this.handleBeforeStatementKinds(node as AbstractStatement);
    });

    this.registerAfterNodeHandler(NodeKind.STATEMENT, undefined, (node) => {
      this.handleAfterStatementKinds(node as AbstractStatement);
    });

    this.registerBeforeNodeHandler(
      NodeKind.ARRAY_DIMENSION,
      undefined,
      (node) => {
        this.handleBeforeArrayDimensionKinds(node as AbstractArrayDimension);
      },
    );

    this.registerAfterNodeHandler(
      NodeKind.ARRAY_DIMENSION,
      undefined,
      (node) => {
        this.handleAfterArrayDimensionKinds(node as AbstractArrayDimension);
      },
    );

    this.registerBeforeNodeHandler(NodeKind.CLASS_ID, undefined, (node) => {
      this.handleBeforeClassIdKinds(node as AbstractClassId);
    });

    this.registerAfterNodeHandler(NodeKind.CLASS_ID, undefined, (node) => {
      this.handleAfterClassIdKinds(node as AbstractClassId);
    });

    this.registerBeforeNodeHandler(NodeKind.EXPRESSION, undefined, (node) => {
      this.handleBeforeExpressionKinds(node as AbstractExpression);
    });

    this.registerAfterNodeHandler(NodeKind.EXPRESSION, undefined, (node) => {
      this.handleAfterExpressionKinds(node as AbstractExpression);
    });

    // Implicit scope registration

    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.IF,
      (node) => this.registerIfStatementImplicitScopes(node as IfStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.SWITCH,
      (node) =>
        this.registerSwitchStatementImplicitScopes(node as SwitchStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.WHILE,
      (node) =>
        this.registerWhileStatementImplicitScopes(node as WhileStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      (node) => this.registerForStatementImplicitScopes(node as ForStatement),
    );

    // Scope enter

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
      NodeKind.STATEMENT,
      StatementKind.CLASS_DECLARATION,
      (node) => this.handleBeforeClassDeclaration(node as ClassDeclaration),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.MAP_DECLARATION,
      (node) => this.handleBeforeMapDeclaration(node as MapDeclaration),
    );

    // Scope exit

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
    this.registerAfterNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
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
  }

  private handleBeforeClassDeclaration(
    classDeclaration: ClassDeclaration,
  ): void {
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

  private handleBeforeMapDeclaration(mapDeclaration: MapDeclaration): void {
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

  private handleBeforeStatementKinds(node: AbstractStatement): void {
    const key = this.subKindKey(node.nodeKind, node.statementKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.beforeVisit) {
        for (const handler of handlers.beforeVisit) {
          handler(node);
        }
      }
    }
  }

  private handleAfterStatementKinds(node: AbstractStatement): void {
    const key = this.subKindKey(node.nodeKind, node.statementKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.afterVisit) {
        for (const handler of handlers.afterVisit) {
          handler(node);
        }
      }
    }
  }

  private handleBeforeArrayDimensionKinds(node: AbstractArrayDimension): void {
    const key = this.subKindKey(node.nodeKind, node.arrayDimensionKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.beforeVisit) {
        for (const handler of handlers.beforeVisit) {
          handler(node);
        }
      }
    }
  }

  private handleAfterArrayDimensionKinds(node: AbstractArrayDimension): void {
    const key = this.subKindKey(node.nodeKind, node.arrayDimensionKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.afterVisit) {
        for (const handler of handlers.afterVisit) {
          handler(node);
        }
      }
    }
  }

  private handleBeforeClassIdKinds(node: AbstractClassId): void {
    const key = this.subKindKey(node.nodeKind, node.classIdKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.beforeVisit) {
        for (const handler of handlers.beforeVisit) {
          handler(node);
        }
      }
    }
  }

  private handleAfterClassIdKinds(node: AbstractClassId): void {
    const key = this.subKindKey(node.nodeKind, node.classIdKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.afterVisit) {
        for (const handler of handlers.afterVisit) {
          handler(node);
        }
      }
    }
  }

  private handleBeforeExpressionKinds(node: AbstractExpression): void {
    const key = this.subKindKey(node.nodeKind, node.expressionKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.beforeVisit) {
        for (const handler of handlers.beforeVisit) {
          handler(node);
        }
      }
    }
  }

  private handleAfterExpressionKinds(node: AbstractExpression): void {
    const key = this.subKindKey(node.nodeKind, node.expressionKind);
    if (
      this.handlersByNodeKindAndSubKind.has(key)
    ) {
      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers && handlers.afterVisit) {
        for (const handler of handlers.afterVisit) {
          handler(node);
        }
      }
    }
  }

  private registerIfStatementImplicitScopes(ifStatement: IfStatement): void {
    if (isStatement(ifStatement.ifStatement)) {
      const ifNode = ifStatement.ifStatement as AbstractStatement;

      if (
        (ifNode.statementKind !== StatementKind.IF) &&
        (ifNode.statementKind !== StatementKind.COMPOUND)
      ) {
        this.implicitScopeNodes.add(ifNode);
      }
    }

    if (isStatement(ifStatement.elseStatement)) {
      const elseNode = ifStatement.elseStatement as AbstractStatement;

      if (
        (elseNode.statementKind !== StatementKind.IF) &&
        (elseNode.statementKind !== StatementKind.COMPOUND)
      ) {
        this.implicitScopeNodes.add(elseNode);
      }
    }
  }

  private registerSwitchStatementImplicitScopes(
    switchStatement: SwitchStatement,
  ): void {
    for (const caseClause of switchStatement.caseClauses) {
      if (isCaseClause(caseClause)) {
        this.implicitScopeNodes.add(caseClause);
      }
    }

    if (isDefaultClause(switchStatement.defaultClause)) {
      this.implicitScopeNodes.add(switchStatement.defaultClause);
    }
  }

  private registerWhileStatementImplicitScopes(
    whileStatement: WhileStatement,
  ): void {
    if (isStatement(whileStatement.statement)) {
      const ifNode = whileStatement.statement as AbstractStatement;

      if (ifNode.statementKind !== StatementKind.COMPOUND) {
        this.implicitScopeNodes.add(ifNode);
      }
    }
  }

  private registerForStatementImplicitScopes(forStatement: ForStatement): void {
    if (isStatement(forStatement.statement)) {
      const ifNode = forStatement.statement as AbstractStatement;

      if (ifNode.statementKind !== StatementKind.COMPOUND) {
        this.implicitScopeNodes.add(ifNode);
      }
    }
  }

  protected registerBeforeNodeHandler(
    nodeKind: NodeKind,
    subKind: number | undefined,
    handler: (node: AbstractCompositeNode) => void,
  ): void {
    if (subKind !== undefined) {
      const key = this.subKindKey(nodeKind, subKind);

      if (!this.handlersByNodeKindAndSubKind.has(key)) {
        this.handlersByNodeKindAndSubKind.set(key, {});
      }

      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers) {
        if (!handlers.beforeVisit) {
          handlers.beforeVisit = [];
        }

        // Special case for class and declarations:
        // The scope needs to be entered AFTER any sub-class implementation
        // but it cannot be done via registerAfterNodeHandler as the child elements
        // have been processed by then.

        if (
          (nodeKind === NodeKind.STATEMENT) &&
          ((subKind === StatementKind.CLASS_DECLARATION) ||
            (subKind === StatementKind.MAP_DECLARATION))
        ) {
          handlers.beforeVisit.unshift(handler);
        } else {
          handlers.beforeVisit.push(handler);
        }
      }
    } else {
      if (!this.handlersByNodeKind.has(nodeKind)) {
        this.handlersByNodeKind.set(nodeKind, {});
      }

      const handlers = this.handlersByNodeKind.get(nodeKind);

      if (handlers) {
        if (!handlers.beforeVisit) {
          handlers.beforeVisit = [];
        }
        handlers.beforeVisit.push(handler);
      }
    }
  }

  protected registerAfterNodeHandler(
    nodeKind: NodeKind,
    subKind: number | undefined,
    handler: (node: AbstractCompositeNode) => void,
  ): void {
    if (subKind !== undefined) {
      const key = this.subKindKey(nodeKind, subKind);

      if (!this.handlersByNodeKindAndSubKind.has(key)) {
        this.handlersByNodeKindAndSubKind.set(key, {});
      }

      const handlers = this.handlersByNodeKindAndSubKind.get(key);

      if (handlers) {
        if (!handlers.afterVisit) {
          handlers.afterVisit = [];
        }
        handlers.afterVisit.push(handler);
      }
    } else {
      if (!this.handlersByNodeKind.has(nodeKind)) {
        this.handlersByNodeKind.set(nodeKind, {});
      }

      const handlers = this.handlersByNodeKind.get(nodeKind);

      if (handlers) {
        if (!handlers.afterVisit) {
          handlers.afterVisit = [];
        }
        handlers.afterVisit.push(handler);
      }
    }
  }

  /**
   * If the node is an unexpected node, throw an error in strict mode or ignore in lenient mode.
   *
   * @param node the leaf node to visit
   */

  beforeVisit(node: AbstractCompositeNode): void {
    if (node.nodeKind === NodeKind.UNEXPECTED_ERROR) {
      if (this.strict) {
        throw new SemanticError(
          "UNEXPECTED_ERROR node encountered",
          node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
        );
      }

      // In lenient mode, we simply ignore the unexpected error node
      logger.debug("Ignoring UNEXPECTED_ERROR node in lenient mode.");
    }

    // Enter any implicit scopes for this node
    if (this.implicitScopeNodes.has(node)) {
      this.symbolTable.enterBlockScope(StatementKind[StatementKind.COMPOUND]);
    }

    if (this.handlersByNodeKind.has(node.nodeKind)) {
      const handlers = this.handlersByNodeKind.get(node.nodeKind);

      if (handlers && handlers.beforeVisit) {
        for (const handler of handlers.beforeVisit) {
          handler(node);
        }
      }
    }
  }

  /**
   * If the node is an error token or unexpected node, throw an error in strict mode or ignore in lenient mode.
   *
   * @param node the leaf node to visit
   */
  visit(node: AbstractLeafNode): void {
    if (node.nodeKind === NodeKind.UNEXPECTED_ERROR) {
      if (this.strict) {
        throw new SemanticError(
          "UNEXPECTED_ERROR node encountered",
          node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
        );
      }

      // In lenient mode, we simply ignore the unexpected error node
      logger.debug("Ignoring UNEXPECTED_ERROR node in lenient mode.");

      return;
    } else if (node.nodeKind === NodeKind.TOKEN) {
      const token = node as Token;

      if (token.tokenKind === TokenKind.ERROR_UNKNOWN_TOKEN) {
        if (this.strict) {
          throw new SemanticError(
            "ERROR_UNKNOWN_TOKEN encountered",
            token.getLocation(),
          );
        }

        // In lenient mode, we simply ignore the ERROR_UNKNOWN_TOKEN
        logger.debug("Ignoring ERROR_UNKNOWN_TOKEN in lenient mode.");

        return;
      }

      if (token.tokenKind === TokenKind.ERROR_MISSING_TOKEN) {
        if (this.strict) {
          throw new SemanticError(
            "ERROR_MISSING_TOKEN encountered",
            token.getLocation(),
          );
        }

        // In lenient mode, we simply ignore the ERROR_MISSING_TOKEN
        logger.debug("Ignoring ERROR_MISSING_TOKEN in lenient mode.");

        return;
      }
    }

    // Leaf nodes do not need to be visited further for analysis
  }

  afterVisit(node: AbstractCompositeNode): void {
    if (this.handlersByNodeKind.has(node.nodeKind)) {
      const handlers = this.handlersByNodeKind.get(node.nodeKind);

      if (handlers && handlers.afterVisit) {
        for (const handler of handlers.afterVisit) {
          handler(node);
        }
      }
    }

    // Exit any implicit scopes we entered for this node
    if (this.implicitScopeNodes.has(node)) {
      this.symbolTable.exitScope();
    }
  }
}
