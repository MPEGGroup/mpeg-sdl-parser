import type { Parser, Plugin, Printer, SupportLanguage } from "prettier";
import { printAbstractNode } from "./print-abstract-node.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import { createLenientSdlParser } from "../lezer/create-sdl-parser.ts";
import { buildAst } from "../ast/build-ast.ts";
import { SdlStringInput } from "../lezer/sdl-string-input.ts";
import {
  isCompositeNode,
  isToken,
  type RequiredNode,
} from "../ast/util/types.ts";
import type { Token } from "../ast/node/token.ts";
import { InternalParseError } from "../parse-error.ts";
import { NodeKind } from "../ast/node/enum/node-kind.ts";

const languages: SupportLanguage[] = [
  {
    name: "sdl",
    parsers: ["sdl"],
  },
];

const parsers: Record<string, Parser<RequiredNode<AbstractNode>>> = {
  sdl: {
    astFormat: "sdl",
    parse: (sdlSpecification: string) => {
      const sdlStringInput = new SdlStringInput(sdlSpecification);
      const sdlParser = createLenientSdlParser();
      const parseTree = sdlParser.parse(sdlSpecification);

      return buildAst(parseTree, sdlStringInput, true);
    },
    locStart: (node: RequiredNode<AbstractNode>) => {
      let token: Token;
      if (isCompositeNode(node)) {
        if (!node.startToken) {
          throw new InternalParseError(
            "Composite node does not have a start token.",
          );
        }
        token = node.startToken;
      } else if (isToken(node)) {
        token = node;
      } else {
        throw new InternalParseError(
          "Unsupported node for prettierPluginSdl: " + NodeKind[node.nodeKind],
        );
      }
      return (token.leadingTrivia &&
          (token.leadingTrivia.length > 0))
        ? token.leadingTrivia[0].location.position
        : token.location.position;
    },
    locEnd: (node: RequiredNode<AbstractNode>) => {
      let token: Token;
      if (isCompositeNode(node)) {
        if (!node.endToken) {
          throw new InternalParseError(
            "Composite node does not have an end token.",
          );
        }
        token = node.endToken;
      } else if (isToken(node)) {
        token = node;
      } else {
        throw new InternalParseError(
          "Unsupported node for prettierPluginSdl: " + NodeKind[node.nodeKind],
        );
      }
      return (token.trailingTrivia &&
          (token.trailingTrivia.length > 0))
        ? token.trailingTrivia[token.trailingTrivia.length - 1].location
          .position
        : token.location.position;
    },
  },
};

const printers: Record<string, Printer<RequiredNode<AbstractNode>>> = {
  "sdl": {
    print: printAbstractNode,
  },
};

export const prettierPluginSdl: Plugin = {
  languages,
  parsers,
  printers,
};
