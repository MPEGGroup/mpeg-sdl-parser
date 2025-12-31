import { type AstPath, type Doc, doc } from "prettier";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import {
  addBreakingWhitespace,
  addIndentedStatements,
  addNonBreakingWhitespace,
} from "./util/print-utils.ts";
import type { ClassDeclaration } from "../ast/node/class-declaration.ts";

const { fill } = doc.builders;

export function printClassDeclaration(
  path: AstPath<ClassDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDeclaration = path.node;
  let doc: Doc = [];

  if (classDeclaration.alignedModifier !== undefined) {
    doc.push(
      path.call(
        print,
        "alignedModifier" as keyof ClassDeclaration["alignedModifier"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  if (classDeclaration.expandableModifier !== undefined) {
    doc.push(
      path.call(
        print,
        "expandableModifier" as keyof ClassDeclaration["expandableModifier"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  if (classDeclaration.abstractKeyword) {
    doc.push(
      path.call(
        print,
        "abstractKeyword" as keyof ClassDeclaration["abstractKeyword"],
      ),
    );
    addNonBreakingWhitespace(doc);
  }

  doc.push(
    path.call(print, "classKeyword"),
  );

  addNonBreakingWhitespace(doc);

  const identifierDoc: Doc = [];
  identifierDoc.push(path.call(print, "identifier"));

  if (classDeclaration.parameterList !== undefined) {
    identifierDoc.push(
      path.call(
        print,
        "parameterList" as keyof ClassDeclaration["parameterList"],
      ),
    );
  }
  doc.push(identifierDoc);
  doc = addBreakingWhitespace(doc);

  if (classDeclaration.extendsModifier !== undefined) {
    doc.push(fill(
      path.call(
        print,
        "extendsModifier" as keyof ClassDeclaration["extendsModifier"],
      ) as Doc[],
    ));
    doc = addBreakingWhitespace(doc);
  }

  if (classDeclaration.bitModifier !== undefined) {
    doc.push(fill(
      path.call(
        print,
        "bitModifier" as keyof ClassDeclaration["bitModifier"],
      ) as Doc[],
    ));
    doc = addBreakingWhitespace(doc);
  }

  const statementsDoc = path.map(print, "statements");

  doc = addIndentedStatements(
    doc,
    statementsDoc,
    path.call(print, "openBracePunctuator"),
    path.call(print, "closeBracePunctuator"),
  );

  return fill(doc);
}
