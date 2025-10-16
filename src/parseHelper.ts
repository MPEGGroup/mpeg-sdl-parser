import { type Tree } from "@lezer/common";
import type { NodeHandler } from "./ast/visitor/NodeHandler.ts";
import type { Specification } from "./ast/node/Specification.ts";
import { SyntacticParseError } from "./ParseError.ts";
import { TraversingVisitor } from "./ast/visitor/TraversingVisitor.ts";
import * as prettier from "prettier/standalone.js";
import { prettierPluginSdl } from "./prettier/prettierPluginSdl.ts";
import type { Plugin } from "prettier";
import { Text } from "@codemirror/state";
import type { AbstractNode } from "./ast/node/AbstractNode.ts";
import { SdlStringInput } from "./lezer/SdlStringInput.ts";
import { getLocationFromTextPosition } from "./util/locationUtils.ts";

/**
 * Create a dynamic prettier plugin for SDL using the pre-parsed AST.
 */
function getPreParsedAstPrettierPlugin(
  specification: Specification,
): Plugin<AbstractNode> {
  const prettierPluginSdlParser = prettierPluginSdl.parsers!.sdl!;

  return {
    languages: prettierPluginSdl.languages,
    parsers: {
      sdl: {
        astFormat: prettierPluginSdlParser.astFormat,
        parse: () => specification,
        locStart: prettierPluginSdlParser.locStart,
        locEnd: prettierPluginSdlParser.locEnd,
      },
    },
    printers: prettierPluginSdl.printers,
  };
}

/**
 * Return a collated list of parse errors from the parse tree.
 *
 * @param parseTree The parse tree generated from the source string.
 * @param sdlStringInput The SDL source `StringInput`.
 */
export function collateParseErrors(
  parseTree: Tree,
  sdlStringInput: SdlStringInput,
): SyntacticParseError[] {
  const text = Text.of(
    sdlStringInput.read(0, sdlStringInput.length).split("\n"),
  );

  const parseErrors = [];
  const errorRows = new Set<number>();

  const cursor = parseTree.cursor();
  do {
    if (cursor.type.isError) {
      const location = getLocationFromTextPosition(text, cursor.from);

      // only keep one error per line
      if (!errorRows.has(location!.row)) {
        errorRows.add(location!.row);

        const error = SyntacticParseError.fromTextAndCursor(text, cursor);

        parseErrors.push(error);
      }
    }
  } while (cursor.next());

  return parseErrors;
}

/**
 * Prettify the source.
 *
 * @param specification The specification to be used for the pre-parsed AST.
 * @param sdlStringInput The SDL source `StringInput`.
 */
export function prettyPrint(
  specification: Specification,
  sdlStringInput: SdlStringInput,
): Promise<string> {
  return prettier.format(sdlStringInput.read(0, sdlStringInput.length), {
    parser: "sdl",
    plugins: [getPreParsedAstPrettierPlugin(specification)],
  });
}

/**
 * Dispatch a node handler to visit all nodes in the abstract syntax tree.
 *
 * @param specification The specification to be traversed.
 * @param nodeHandler The handler to perform operations on each node.
 */
export function dispatchNodeHandler(
  specification: Specification,
  nodeHandler: NodeHandler,
) {
  const traversingVisitor = new TraversingVisitor(nodeHandler);

  traversingVisitor.visit(specification);
}
