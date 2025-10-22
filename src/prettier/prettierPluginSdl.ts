import type { Parser, Plugin, Printer, SupportLanguage } from "prettier";
import { printAbstractNode } from "./print_abstract_node.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import { createStrictSdlParser } from "../lezer/createSdlParser.ts";
import { buildAst } from "../ast/buildAst.ts";
import { SdlStringInput } from "../lezer/SdlStringInput.ts";

const languages: SupportLanguage[] = [
  {
    name: "sdl",
    parsers: ["sdl"],
  },
];

const parsers: Record<string, Parser<AbstractNode>> = {
  sdl: {
    astFormat: "sdl",
    parse: (sdlSpecification: string) => {
      const sdlStringInput = new SdlStringInput(sdlSpecification);
      const sdlParser = createStrictSdlParser();
      const parseTree = sdlParser.parse(sdlSpecification);

      return buildAst(parseTree, sdlStringInput);
    },
    locStart: (node: AbstractNode) => {
      return node.startToken.leadingTrivia.length > 0
        ? node.startToken.leadingTrivia[0].location.position
        : node.startToken.location.position;
    },
    locEnd: (node: AbstractNode) => {
      return node.endToken.trailingTrivia.length > 0
        ? node.endToken.trailingTrivia[node.endToken.trailingTrivia.length - 1]
          .location.position
        : node.endToken.location.position;
    },
  },
};

const printers: Record<string, Printer<AbstractNode>> = {
  "sdl": {
    print: printAbstractNode,
  },
};

export const prettierPluginSdl: Plugin = {
  languages,
  parsers,
  printers,
};
