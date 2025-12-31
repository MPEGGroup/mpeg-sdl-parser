import type { Tree } from "@lezer/common";
import { Text } from "@codemirror/state";
import type { SdlStringInput } from "../lezer/sdl-string-input.ts";
import type { Specification } from "./node/specification.ts";
import { debugEnabled } from "../util/logger.ts";
import type { NodeHandler } from "./visitor/node-handler.ts";
import { TraversingVisitor } from "./visitor/traversing-visitor.ts";
import { InternalParseError } from "../parse-error.ts";
import type { BuildContext } from "./build/util/build-context.ts";
import type { RequiredNode } from "./util/types.ts";
import { fetchRequiredNode } from "./build/util/fetch-node.ts";
import { NodeKind } from "./node/enum/node-kind.ts";
import { nodeKindByTokenTypeId } from "./build/util/node-kind-by-token-type-id-map.ts";

/**
 * Process the SDL parse tree and return an abstract syntax tree.
 *
 * @param parseTree The parse `Tree` generated from the SDL source.
 * @param sdlStringInput The SDL source text as an `SdlStringInput`.
 * @param lenient If true, the AST construction will be lenient and create error tokens and nodes for parse errors in the parse tree.
 */
export function buildAst(
  parseTree: Tree,
  sdlStringInput: SdlStringInput,
  lenient = false,
): RequiredNode<Specification> {
  const text = Text.of(
    sdlStringInput.read(0, sdlStringInput.length).split("\n"),
  );
  const cursor = parseTree.cursor();
  const buildContext: BuildContext = {
    cursor,
    text,
    lenient,
    stateStack: [{ indent: "", isEndOfSiblings: false }],
  };

  const nodeKind = nodeKindByTokenTypeId.get(cursor.type.id);

  if (nodeKind === undefined) {
    throw new InternalParseError(
      `No nodeKind mapping found for token type id: ${cursor.type.id} (${cursor.type.name})`,
    );
  }

  // check the root node is a Specification
  if (nodeKind !== NodeKind.SPECIFICATION) {
    throw new InternalParseError(
      `Expected start node to be a Specification, but found ${
        NodeKind[nodeKind]
      }.`,
    );
  }

  const specification = fetchRequiredNode<Specification>(
    buildContext,
    NodeKind.SPECIFICATION,
  );

  if (buildContext.stateStack.length !== 1) {
    throw new InternalParseError(
      `Expected final build context state stack length to be 1, but found ${buildContext.stateStack.length}.`,
    );
  }

  if (!specification) {
    throw new InternalParseError(
      `Expected to parse a Specification node, but none was found.`,
    );
  }

  if ((nodeKind !== NodeKind.SPECIFICATION) && (!cursor.type.isError)) {
    throw new InternalParseError(
      `Expected final node to be a Specification or an error, but found ${
        NodeKind[nodeKind]
      }.`,
    );
  }

  // check if any unconsumed trivia remain which
  if (buildContext.unconsumedTrivia) {
    if (!specification.trailingTrivia) {
      specification.trailingTrivia = [];
    }

    // filter from the end any empty blank line trivia
    while (
      (buildContext.unconsumedTrivia.length > 0) &&
      (buildContext.unconsumedTrivia[
        buildContext.unconsumedTrivia.length - 1
      ].text.trim() === "")
    ) {
      buildContext.unconsumedTrivia.pop();
    }

    specification.trailingTrivia.push(
      ...buildContext.unconsumedTrivia,
    );

    delete buildContext.unconsumedTrivia;
  }

  if (debugEnabled) {
    const dummyNodeHandler: NodeHandler = {
      beforeVisit: () => {},
      visit: () => {},
      afterVisit: () => {},
    };
    const traversingVisitor = new TraversingVisitor(dummyNodeHandler);
    traversingVisitor.visit(specification);
  }

  return specification;
}
