import { AstPath, type Doc, doc } from "prettier";
import { getDocWithTrivia } from "./print_utils.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { CaseClause } from "../ast/node/CaseClause.ts";
import type { DefaultClause } from "../ast/node/DefaultClause.ts";
import type { SwitchStatement } from "../ast/node/SwitchStatement.ts";
const { hardline, indent, join } = doc.builders;

export function printCaseClause(
  path: AstPath<CaseClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const caseClause = path.node;
  const subElements = [];

  subElements.push(getDocWithTrivia(caseClause.caseKeyword));
  subElements.push([
    path.call(print, "value"),
    getDocWithTrivia(caseClause.colonPunctuator),
  ]);

  if (caseClause.openBracePunctuator !== undefined) {
    subElements.push(
      getDocWithTrivia(caseClause.openBracePunctuator),
    );
  }

  const elements = [
    join(" ", subElements),
  ];

  const statementElements = [];

  if (caseClause.statements.length > 0) {
    statementElements.push(...path.map(print, "statements"));
  }

  if (caseClause.breakKeyword !== undefined) {
    statementElements.push([
      getDocWithTrivia(caseClause.breakKeyword),
      getDocWithTrivia(caseClause.semicolonPunctuator!),
    ]);
  }

  if (statementElements.length > 0) {
    elements.push(
      [indent(
        [
          hardline,
          join(hardline, statementElements),
        ],
      )],
    );
  }
  if (caseClause.closeBracePunctuator !== undefined) {
    elements.push(
      getDocWithTrivia(caseClause.closeBracePunctuator, true),
    );
  }

  return elements;
}

export function printDefaultClause(
  path: AstPath<DefaultClause>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const defaultClause = path.node;
  const subElements = [];

  subElements.push([
    getDocWithTrivia(defaultClause.defaultKeyword),
    getDocWithTrivia(defaultClause.colonPunctuator),
  ]);

  if (defaultClause.openBracePunctuator !== undefined) {
    subElements.push(
      getDocWithTrivia(defaultClause.openBracePunctuator),
    );
  }

  const elements = [
    join(" ", subElements),
  ];

  const statementElements = [];

  if (defaultClause.statements.length > 0) {
    statementElements.push(...path.map(print, "statements"));
  }

  if (statementElements.length > 0) {
    elements.push(
      [indent(
        [
          hardline,
          join(hardline, statementElements),
        ],
      )],
    );
  }

  if (defaultClause.closeBracePunctuator !== undefined) {
    elements.push(
      getDocWithTrivia(defaultClause.closeBracePunctuator, true),
    );
  }

  return elements;
}

export function printSwitchStatement(
  path: AstPath<SwitchStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const switchStatement = path.node;

  const subElements = [];
  subElements.push(getDocWithTrivia(switchStatement.switchKeyword));
  subElements.push([
    getDocWithTrivia(switchStatement.openParenthesisPunctuator),
    path.call(print, "expression"),
    getDocWithTrivia(switchStatement.closeParenthesisPunctuator),
  ]);
  subElements.push(getDocWithTrivia(switchStatement.openBracePunctuator));

  const elements = [
    join(" ", subElements),
  ];

  const caseClauses = [];

  caseClauses.push(
    ...path.map(print, "caseClauses"),
  );

  if (switchStatement.defaultClause !== undefined) {
    caseClauses.push(path.call(
      print,
      "defaultClause" as keyof SwitchStatement["defaultClause"],
    ));
  }

  elements.push(
    [indent([
      hardline,
      join(hardline, caseClauses),
    ])],
  );

  elements.push(
    getDocWithTrivia(switchStatement.closeBracePunctuator, true),
  );

  return elements;
}
