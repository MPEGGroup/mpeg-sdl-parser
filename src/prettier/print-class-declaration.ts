import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import {
  addBreakingSeparator,
  addIndentedBlock,
  addNonBreakingSeparator,
} from "./util/print-utils.ts";
import type { ClassDeclaration } from "../ast/node/class-declaration.ts";

const { fill } = doc.builders;

export function printClassDeclaration(
  path: AstPath<ClassDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDeclaration = path.node;
  const docs: Doc = [];

  if (classDeclaration.alignedModifier !== undefined) {
    docs.push(
      path.call(
        print,
        "alignedModifier" as keyof ClassDeclaration["alignedModifier"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  if (classDeclaration.expandableModifier !== undefined) {
    docs.push(
      path.call(
        print,
        "expandableModifier" as keyof ClassDeclaration["expandableModifier"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  if (classDeclaration.abstractKeyword) {
    docs.push(
      path.call(
        print,
        "abstractKeyword" as keyof ClassDeclaration["abstractKeyword"],
      ),
    );
    addNonBreakingSeparator(docs);
  }

  docs.push(
    path.call(print, "classKeyword"),
  );

  addNonBreakingSeparator(docs);

  const identifierDocs: Doc[] = [];
  identifierDocs.push(path.call(print, "identifier"));

  if (classDeclaration.parameterList !== undefined) {
    identifierDocs.push(
      path.call(
        print,
        "parameterList" as keyof ClassDeclaration["parameterList"],
      ),
    );
  }
  docs.push(identifierDocs);
  addBreakingSeparator(docs);

  if (classDeclaration.extendsModifier !== undefined) {
    docs.push(fill(
      path.call(
        print,
        "extendsModifier" as keyof ClassDeclaration["extendsModifier"],
      ) as Doc[],
    ));
    addBreakingSeparator(docs);
  }

  if (classDeclaration.bitModifier !== undefined) {
    docs.push(fill(
      path.call(
        print,
        "bitModifier" as keyof ClassDeclaration["bitModifier"],
      ) as Doc[],
    ));
    addBreakingSeparator(docs);
  }

  const statementDocs = path.map(print, "statements");

  addIndentedBlock(
    docs,
    statementDocs,
    classDeclaration.openBracePunctuator,
    classDeclaration.closeBracePunctuator,
  );

  return fill(docs);
}
