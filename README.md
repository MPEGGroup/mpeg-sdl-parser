# mpeg-sdl-parser

> ISO/IEC 14496-34 Syntactic Description Language (MPEG SDL) parser implemented
> in TypeScript

[![version](https://img.shields.io/github/v/release/mpeggroup/mpeg-sdl-parser?sort=semver)](https://github.com/mpeggroup/mpeg-sdl-parser/releases)
[![build](https://img.shields.io/github/actions/workflow/status/mpeggroup/mpeg-sdl-parser/release-bun-library.yml)](https://github.com/mpeggroup/mpeg-sdl-parser/actions/workflows/release-bun-library.yml)
[![docs](https://img.shields.io/badge/docs-API-blue)](https://mpeggroup.github.io/mpeg-sdl-parser/index.html)
[![license: MIT](https://img.shields.io/github/license/mpeggroup/mpeg-sdl-parser)](https://github.com/mpeggroup/mpeg-sdl-parser/blob/main/LICENSE)

## Web Editor

A browser based web editor using this module is available at
https://github.com/MPEGGroup/mpeg-sdl-editor

## Bun Module Usage

Add the module:

`bun add @mpeggroup/mpeg-sdl-parser`

```javascript
import {
  SdlStringInput,
  createLenientSdlParser,
  collateParseErrors,
  buildAst,
  dispatchNodeHandler,
  prettyPrint
} from "@mpeggroup/mpeg-sdl-parser";

// Create a Lezer based SDL parser
// This will create a lenient parser which recovers from parse errors and places error nodes in the parse tree.
// A strict parser which will throw SyntacticParseError can be created with createStrictSdlParser().
const parser = await createLenientSdlParser();

// Prepare the SDL input
const sdlStringInput = new SdlStringInput("computed int i;");

// Parse SDL input and produce a parse tree
const sdlParseTree = sdlParser.parse(sdlStringInput);

// Traverse and print the parse tree
const cursor = sdlParseTree.cursor();
do {
  console.log(`Node ${cursor.name} from ${cursor.from} to ${cursor.to}`)
} while (cursor.next());

// Print any parsing errors by collating any error nodes in the parse tree
const parseErrors = collateParseErrors(sdlParseTree, sdlStringInput);

console.log(JSON.stringify(parseErrors);

// Build an Abstract Syntax Tree (AST) of the SDL specification from the parse tree
// Note that this will throw a SyntacticParseError if the parse tree contains parsing errors.
const specification = buildAst(sdlParseTree, sdlStringInput);

// Define a simple AST Node handler
class MyNodeHandler implements NodeHandler {
  beforeVisit(node: AbstractCompositeNode) {
    console.log("About to visit child nodes");
  }

  visit(node: AbstractLeafNode) {
    console.log("Visiting leaf node");
  }

  afterVisit(node: AbstractCompositeNode) {
    console.log("Finished visiting child nodes");
  }
}

// Dispatch the handler to visit all nodes in the AST
dispatchNodeHandler(specification, new MyNodeHandler());

// Pretty print the specification (retaining comments)
let prettifiedSpecification = await prettyPrint(specification, sdlStringInput)

console.log(prettifiedSpecification);

// A Prettier (prettier.io) plugin for SDL is also available:
import * as prettier from "prettier/standalone.js";
import { prettierPluginSdl } from "@mpeggroup/mpeg-sdl-parser"; 

prettifiedSpecification = await prettier.format("computed int i;", { 
  parser: "sdl",
  plugins: [prettierPluginSdl],
});

console.log(prettifiedSpecification);
```

## Development

Install dependencies:

`bun install`

Generate parser from grammar:

`bun run generate`

Test:

`bun test`

**NOTE**: The following tasks use Deno as it excels at these and Bun does not
currently provide such functionality:

Format:

`deno fmt`

Lint:

`deno lint index.ts src/ tests/`

Generate HTML API Documentation:

`deno doc --html --name=mpeg-sdl-parser index.ts`

## Documentation

### Overview

The parser is implemented using [Lezer](https://lezer.codemirror.net) using the
Lezer grammar defined in [sdl.lezer.grammar](grammar/sdl.lezer.grammar).

For reference purposes an SDL EBNF grammar is also provided in
[sdl.ebnf.grammar](grammar/sdl.ebnf.grammar)

### Abstract Syntax Tree Model

```mermaid
classDiagram

  class Location {
    row: number
    column: number
    position: number
  }

  class AbstractNode {
    nodeKind: NodeKind
    text: string
    accept(visitor: NodeVisitor) boolean
  }

  class AbstractLeafNode {
    isCompositeNode = false
  }

  class AbstractCompositeNode {
    isCompositeNode = true
    getChildNodeIterable() IterableIterator
  }

  class NodeHandler {
    beforeVisit(node: AbstractCompositeNode)
    visit(node: AbstractLeafNode)
    afterVisit(node: AbstractCompositeNode)
  }

  AbstractNode --> Location : location
  AbstractLeafNode --|> AbstractNode

  AbstractCompositeNode --|> AbstractNode
  AbstractCompositeNode --> "*" AbstractNode : childNodes

  LeafNodeXXX "*" --|> AbstractLeafNode
  CompositeNodeYYY "*" --|> AbstractCompositeNode

  Specification --|> AbstractCompositeNode

  NodeHandler ..> AbstractCompositeNode : beforeVisit
  NodeHandler ..> AbstractLeafNode : visit
  NodeHandler ..> AbstractCompositeNode : afterVisit
```

### API

Link to auto-generated API docs:

[API Documentation](https://mpeggroup.github.io/mpeg-sdl-parser)

### Debug Logging

Internal framework logging can be enabled by setting the `MPEG_SDL_PARSER_DEBUG`
environment variable. If running in a browser open the developer console and
run:

`localStorage.setItem("MPEG_SDL_PARSER_DEBUG", "true")`

The logging implementation will look for an object conforming to the `Logger`
interface and use it if found. If not found, a simple logging implementation
using the `console` object will be used.

## License

MIT © Flowscripter
