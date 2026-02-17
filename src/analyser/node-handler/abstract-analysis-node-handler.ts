import type { AbstractArrayDimension } from "../../ast/node/abstract-array-dimension.ts";
import type { AbstractClassId } from "../../ast/node/abstract-class-id.ts";
import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractExpression } from "../../ast/node/abstract-expression.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import type { AbstractStatement } from "../../ast/node/abstract-statement.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { StatementKind } from "../../ast/node/enum/statement-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { ForStatement } from "../../ast/node/for-statement.ts";
import type { IfStatement } from "../../ast/node/if-statement.ts";
import type { SwitchStatement } from "../../ast/node/switch-statement.ts";
import type { Token } from "../../ast/node/token.ts";
import type { WhileStatement } from "../../ast/node/while-statement.ts";
import {
  isCaseClause,
  isDefaultClause,
  isStatement,
} from "../../ast/util/types.ts";
import type { NodeHandler } from "../../ast/visitor/node-handler.ts";
import { SemanticError } from "../../scanner-error.ts";
import getLogger from "../../util/logger.ts";
import type { SymbolTable } from "../symbol-table.ts";

const logger = getLogger("AbstractAnalysisNodeHandler");

/**
 * This abstract class provides a base implementation for node handlers that analyze
 * abstract syntax tree (AST) nodes. It implements the `NodeHandler` interface and
 * provides default behaviour to handle error nodes and missing required values in
 * either strict or lenient mode.
 *
 * Handlers for specific node kinds and sub-kinds can be registered using the `registerBeforeNodeHandler`
 * and `registerAfterNodeHandler` methods, which will be called before and after visiting nodes of the specified kinds, respectively.
 *
 * In strict mode, encountering an unexpected error node or an error token will throw a `SemanticError`.
 * In lenient mode, these nodes will be ignored, and a debug message will be logged.
 */
export abstract class AbstractAnalysisNodeHandler implements NodeHandler {
  handlersByNodeKind: Map<NodeKind, {
    beforeVisit?: ((node: AbstractCompositeNode) => void)[];
    afterVisit?: ((node: AbstractCompositeNode) => void)[];
  }> = new Map();

  handlersByNodeKindAndSubKind: Map<string, {
    beforeVisit?: ((node: AbstractCompositeNode) => void)[];
    afterVisit?: ((node: AbstractCompositeNode) => void)[];
  }> = new Map();

  // Set of nodes that we encounter that should implicitly create a new scope
  // - if statements with non-compound bodies
  // - switch case clauses with non-compound bodies
  // - switch default clause with non-compound body
  // - while statements with non-compound bodies
  // - for statements with non-compound bodies
  protected implicitScopeNodes: Set<AbstractCompositeNode> = new Set();

  private subKindKey(nodeKind: NodeKind, subKind: number): string {
    return `${nodeKind}:${subKind}`;
  }

  constructor(
    public readonly symbolTable: SymbolTable,
    public readonly strict: boolean,
  ) {
    // use our own beforeVisit and afterVisit implementations to dispatch to the appropriate handlers based on node kind and sub-kind
    this.registerBeforeNodeHandler(NodeKind.STATEMENT, undefined, (node) => {
      this.beforeStatementHandler(node as AbstractStatement);
    });

    this.registerAfterNodeHandler(NodeKind.STATEMENT, undefined, (node) => {
      this.afterStatementHandler(node as AbstractStatement);
    });

    this.registerBeforeNodeHandler(
      NodeKind.ARRAY_DIMENSION,
      undefined,
      (node) => {
        this.beforeArrayDimensionHandler(node as AbstractArrayDimension);
      },
    );

    this.registerAfterNodeHandler(
      NodeKind.ARRAY_DIMENSION,
      undefined,
      (node) => {
        this.afterArrayDimensionHandler(node as AbstractArrayDimension);
      },
    );

    this.registerBeforeNodeHandler(NodeKind.CLASS_ID, undefined, (node) => {
      this.beforeClassIdHandler(node as AbstractClassId);
    });

    this.registerAfterNodeHandler(NodeKind.CLASS_ID, undefined, (node) => {
      this.afterClassIdHandler(node as AbstractClassId);
    });

    this.registerBeforeNodeHandler(NodeKind.EXPRESSION, undefined, (node) => {
      this.beforeExpressionHandler(node as AbstractExpression);
    });

    this.registerAfterNodeHandler(NodeKind.EXPRESSION, undefined, (node) => {
      this.afterExpressionHandler(node as AbstractExpression);
    });
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.IF,
      (node) => this.beforeIfStatement(node as IfStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.SWITCH,
      (node) => this.beforeSwitchStatement(node as SwitchStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.WHILE,
      (node) => this.beforeWhileStatement(node as WhileStatement),
    );
    this.registerBeforeNodeHandler(
      NodeKind.STATEMENT,
      StatementKind.FOR,
      (node) => this.beforeForStatement(node as ForStatement),
    );
  }

  beforeStatementHandler(node: AbstractStatement): void {
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

  afterStatementHandler(node: AbstractStatement): void {
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

  beforeArrayDimensionHandler(node: AbstractArrayDimension): void {
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

  afterArrayDimensionHandler(node: AbstractArrayDimension): void {
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

  beforeClassIdHandler(node: AbstractClassId): void {
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

  afterClassIdHandler(node: AbstractClassId): void {
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

  beforeExpressionHandler(node: AbstractExpression): void {
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

  afterExpressionHandler(node: AbstractExpression): void {
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

  private beforeIfStatement(ifStatement: IfStatement): void {
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

  private beforeSwitchStatement(switchStatement: SwitchStatement): void {
    for (const caseClause of switchStatement.caseClauses) {
      if (isCaseClause(caseClause)) {
        this.implicitScopeNodes.add(caseClause);
      }
    }

    if (isDefaultClause(switchStatement.defaultClause)) {
      this.implicitScopeNodes.add(switchStatement.defaultClause);
    }
  }

  private beforeWhileStatement(whileStatement: WhileStatement): void {
    if (isStatement(whileStatement.statement)) {
      const ifNode = whileStatement.statement as AbstractStatement;

      if (ifNode.statementKind !== StatementKind.COMPOUND) {
        this.implicitScopeNodes.add(ifNode);
      }
    }
  }

  private beforeForStatement(forStatement: ForStatement): void {
    if (isStatement(forStatement.statement)) {
      const ifNode = forStatement.statement as AbstractStatement;

      if (ifNode.statementKind !== StatementKind.COMPOUND) {
        this.implicitScopeNodes.add(ifNode);
      }
    }
  }

  registerBeforeNodeHandler(
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
        handlers.beforeVisit.push(handler);
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

  registerAfterNodeHandler(
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
            token.location,
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
            token.location,
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
