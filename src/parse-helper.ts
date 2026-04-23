import { type Tree } from "@lezer/common";
import type { NodeHandler } from "./ast/visitor/node-handler.ts";
import type { Specification } from "./ast/node/specification.ts";
import { SyntaxError } from "./scanner-error.ts";
import { TraversingVisitor } from "./ast/visitor/traversing-visitor.ts";
import * as prettier from "prettier/standalone.js";
import { prettierPluginSdl } from "./prettier/prettier-plugin-sdl.ts";
import type { Plugin } from "prettier";
import { Text } from "@codemirror/state";
import type { AbstractNode } from "./ast/node/abstract-node.ts";
import { SdlStringInput } from "./lezer/sdl-string-input.ts";
import { createSyntaxErrorFromTextAndCursor } from "./lezer/create-syntax-error-from-text-and-cursor.ts";

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
 * Return a collated list of syntax errors from the parse tree.
 *
 * @param parseTree The parse tree generated from the source string.
 * @param sdlStringInput The SDL source `StringInput`.
 */
export function collateSyntaxErrors(
  parseTree: Tree,
  sdlStringInput: SdlStringInput,
): SyntaxError[] {
  const text = Text.of(
    sdlStringInput.read(0, sdlStringInput.length).split("\n"),
  );

  const syntaxErrors = [];
  const cursor = parseTree.cursor();
  do {
    if (cursor.type.isError) {
      syntaxErrors.push(createSyntaxErrorFromTextAndCursor(text, cursor));
    }
  } while (cursor.next());

  return syntaxErrors;
}

/**
 * Prettify the source.
 *
 * @param specification The specification to be used for the pre-parsed AST.
 * @param sdlStringInput The SDL source `StringInput`.
 * @param lineWidth The line width to format to.
 */
export function prettyPrint(
  specification: Specification,
  sdlStringInput: SdlStringInput,
  lineWidth = 80,
): Promise<string> {
  return prettier.format(sdlStringInput.read(0, sdlStringInput.length), {
    parser: "sdl",
    plugins: [getPreParsedAstPrettierPlugin(specification)],
    printWidth: lineWidth,
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
