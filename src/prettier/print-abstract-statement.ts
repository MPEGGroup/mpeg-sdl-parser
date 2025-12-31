import { AstPath, type Doc, doc } from "prettier";
import { addIndentedStatements } from "./util/print-utils.ts";
import { printArrayDefinition } from "./print-array-definition.ts";
import { printDoStatement } from "./print-do-statement.ts";
import { printForStatement } from "./print-for-statement.ts";
import { printWhileStatement } from "./print-while-statement.ts";
import { printIfStatement } from "./print-if-statement.ts";
import { printSwitchStatement } from "./print-switch-statement.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { AbstractStatement } from "../ast/node/abstract-statement.ts";
import type { ArrayDefinition } from "../ast/node/array-definition.ts";
import type { ClassDefinition } from "../ast/node/class-definition.ts";
import type { CompoundStatement } from "../ast/node/compound-statement.ts";
import type { ComputedArrayDefinition } from "../ast/node/computed-array-definition.ts";
import type { ComputedElementaryTypeDefinition } from "../ast/node/computed-elementary-type-definition.ts";
import type { ElementaryTypeDefinition } from "../ast/node/elementary-type-definition.ts";
import { StatementKind } from "../ast/node/enum/statement-kind.ts";
import type { MapDeclaration } from "../ast/node/map-declaration.ts";
import type { MapDefinition } from "../ast/node/map-definition.ts";
import type { StringDefinition } from "../ast/node/string-definition.ts";
import type { ExpressionStatement } from "../ast/node/expression-statement.ts";
import type { SwitchStatement } from "../ast/node/switch-statement.ts";
import type { IfStatement } from "../ast/node/if-statement.ts";
import type { WhileStatement } from "../ast/node/while-statement.ts";
import type { ForStatement } from "../ast/node/for-statement.ts";
import type { DoStatement } from "../ast/node/do-statement.ts";
import type { ClassDeclaration } from "../ast/node/class-declaration.ts";
import { printClassDeclaration } from "./print-class-declaration.ts";
import { printClassDefinition } from "./print-class-definition.ts";
import { printComputedArrayDefinition } from "./print-computed-array-definition.ts";
import { printMapDeclaration } from "./print-map-declaration.ts";
import { printStringDefinition } from "./print-string-definition.ts";
import { printMapDefinition } from "./print-map-definition.ts";
import { printComputedElementaryTypeDefinition } from "./print-computed-elementary-type-definition.ts";
import { printElementaryTypeDefinition } from "./print-elementary-type-definition.ts";

const { fill } = doc.builders;

function printCompoundStatement(
  path: AstPath<CompoundStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  let doc: Doc = [];

  const statementsDoc = path.map(print, "statements");
  doc = addIndentedStatements(
    doc,
    statementsDoc,
    path.call(print, "openBracePunctuator"),
    path.call(print, "closeBracePunctuator"),
  );
  return doc;
}

function printExpressionStatement(
  path: AstPath<ExpressionStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  return fill([
    path.call(print, "expression"),
    path.call(print, "semicolonPunctuator"),
  ]);
}

export function printAbstractStatement(
  path: AstPath<AbstractStatement>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const abstractStatement = path.node;
  const statementKind = abstractStatement.statementKind;
  switch (statementKind) {
    case StatementKind.ARRAY_DEFINITION:
      return printArrayDefinition(path as AstPath<ArrayDefinition>, print);
    case StatementKind.COMPUTED_ARRAY_DEFINITION:
      return printComputedArrayDefinition(
        path as AstPath<ComputedArrayDefinition>,
        print,
      );
    case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
      return printComputedElementaryTypeDefinition(
        path as AstPath<ComputedElementaryTypeDefinition>,
        print,
      );
    case StatementKind.CLASS_DECLARATION:
      return printClassDeclaration(path as AstPath<ClassDeclaration>, print);
    case StatementKind.CLASS_DEFINITION:
      return printClassDefinition(path as AstPath<ClassDefinition>, print);
    case StatementKind.COMPOUND:
      return printCompoundStatement(path as AstPath<CompoundStatement>, print);
    case StatementKind.DO:
      return printDoStatement(path as AstPath<DoStatement>, print);
    case StatementKind.ELEMENTARY_TYPE_DEFINITION:
      return printElementaryTypeDefinition(
        path as AstPath<ElementaryTypeDefinition>,
        print,
      );
    case StatementKind.EXPRESSION:
      return printExpressionStatement(
        path as AstPath<ExpressionStatement>,
        print,
      );
    case StatementKind.FOR:
      return printForStatement(path as AstPath<ForStatement>, print);
    case StatementKind.IF:
      return printIfStatement(path as AstPath<IfStatement>, print);
    case StatementKind.MAP_DECLARATION:
      return printMapDeclaration(path as AstPath<MapDeclaration>, print);
    case StatementKind.MAP_DEFINITION:
      return printMapDefinition(path as AstPath<MapDefinition>, print);
    case StatementKind.STRING_DEFINITION:
      return printStringDefinition(path as AstPath<StringDefinition>, print);
    case StatementKind.SWITCH:
      return printSwitchStatement(path as AstPath<SwitchStatement>, print);
    case StatementKind.WHILE:
      return printWhileStatement(path as AstPath<WhileStatement>, print);
    default: {
      const exhaustiveCheck: never = statementKind;
      throw new InternalParseError(
        "Unreachable code reached, statementKind == " + exhaustiveCheck,
      );
    }
  }
}
