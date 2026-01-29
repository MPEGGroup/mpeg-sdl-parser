import type { AbstractCompositeNode } from "../../ast/node/abstract-composite-node.ts";
import type { AbstractLeafNode } from "../../ast/node/abstract-leaf-node.ts";
import { NodeKind } from "../../ast/node/enum/node-kind.ts";
import { TokenKind } from "../../ast/node/enum/token-kind.ts";
import type { Token } from "../../ast/node/token.ts";
import type { NodeHandler } from "../../ast/visitor/node-handler.ts";
import { SemanticError } from "../../scanner-error.ts";
import getLogger from "../../util/logger.ts";

const logger = getLogger("AbstractAnalysisNodeHandler");

/**
 * This abstract class provides a base implementation for node handlers that analyze
 * abstract syntax tree (AST) nodes. It implements the `NodeHandler` interface and
 * provides default behaviour to handle error nodes and missing required values in
 * either strict or lenient mode.
 */
export abstract class AbstractAnalysisNodeHandler implements NodeHandler {
  constructor(public readonly strictMode: boolean) {}

  abstract doBeforeVisit(node: AbstractCompositeNode): void;

  abstract doVisit(node: AbstractLeafNode): void;

  abstract doAfterVisit(node: AbstractCompositeNode): void;

  beforeVisit(node: AbstractCompositeNode): void {
    if (node.nodeKind === NodeKind.UNEXPECTED_ERROR) {
      if (this.strictMode) {
        throw new SemanticError(
          "UNEXPECTED_ERROR node encountered",
          node.leadingTrivia ? node.leadingTrivia[0].location : undefined,
        );
      }

      // In lenient mode, we simply ignore the unexpected error node
      logger.debug("Ignoring UNEXPECTED_ERROR node in lenient mode.");
    }

    this.doBeforeVisit(node);
  }

  /**
   * If the node is an error node, throw an error in strict mode or ignore in lenient mode.
   *
   * @param node the leaf node to visit
   */
  visit(node: AbstractLeafNode): void {
    if (node.nodeKind === NodeKind.UNEXPECTED_ERROR) {
      if (this.strictMode) {
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
        if (this.strictMode) {
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
        if (this.strictMode) {
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

    this.doVisit(node);
  }

  afterVisit(node: AbstractCompositeNode): void {
    // Nothing to do here for error nodes as they are handled in visit()
    this.doAfterVisit(node);
  }
}
