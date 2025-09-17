import type { Tree } from "@lezer/common";
import { Text } from "@codemirror/state";
import type { SdlStringInput } from "../lezer/SdlStringInput.ts";
import type { Specification } from "./node/Specification.ts";
import { Specification as SpecificationNodeType } from "../lezer/parser.terms.ts";
import { NodeFactory } from "./factory/NodeFactory.ts";
import { debugEnabled } from "../util/logger.ts";
import type { NodeHandler } from "./visitor/NodeHandler.ts";
import { TraversingVisitor } from "./visitor/TraversingVisitor.ts";
import { InternalParseError } from "../ParseError.ts";

/**
 * Process the SDL parse tree and return an abstract syntax tree.
 *
 * @param parseTree The parse `Tree` generated from the SDL source.
 * @param sdlStringInput The SDL source text as an `SdlStringInput`.
 */
export function buildAst(
  parseTree: Tree,
  sdlStringInput: SdlStringInput,
): Specification {
  const text = Text.of(
    sdlStringInput.read(0, sdlStringInput.length).split("\n"),
  );
  const cursor = parseTree.cursor();

  if (cursor.type.id !== SpecificationNodeType) {
    throw new InternalParseError(
      "Expected top node of parseTree to be of type Specification, it was: " +
        cursor.type.name,
    );
  }

  const specification = NodeFactory.createNode(
    cursor,
    text,
  ) as Specification;

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
