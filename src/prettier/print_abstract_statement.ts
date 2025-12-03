import { AstPath, type Doc, doc } from "prettier";
import { addIndentedBlock } from "./print_utils.ts";
import { printArrayDefinition } from "./print_array_definition.ts";
import { printDoStatement } from "./print_do_statement.ts";
import { printForStatement } from "./print_for_statement.ts";
import { printWhileStatement } from "./print_while_statement.ts";
import { printIfStatement } from "./print_if_statement.ts";
import { printSwitchStatement } from "./print_switch_statement.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { AbstractStatement } from "../ast/node/AbstractStatement.ts";
import type { ArrayDefinition } from "../ast/node/ArrayDefinition.ts";
import type { ClassDefinition } from "../ast/node/ClassDefinition.ts";
import type { CompoundStatement } from "../ast/node/CompoundStatement.ts";
import type { ComputedArrayDefinition } from "../ast/node/ComputedArrayDefinition.ts";
import type { ComputedElementaryTypeDefinition } from "../ast/node/ComputedElementaryTypeDefinition.ts";
import type { ElementaryTypeDefinition } from "../ast/node/ElementaryTypeDefinition.ts";
import { StatementKind } from "../ast/node/enum/statement_kind.ts";
import type { MapDeclaration } from "../ast/node/MapDeclaration.ts";
import type { MapDefinition } from "../ast/node/MapDefinition.ts";
import type { StringDefinition } from "../ast/node/StringDefinition.ts";
import type { ExpressionStatement } from "../ast/node/ExpressionStatement.ts";
import type { SwitchStatement } from "../ast/node/SwitchStatement.ts";
import type { IfStatement } from "../ast/node/IfStatement.ts";
import type { WhileStatement } from "../ast/node/WhileStatement.ts";
import type { ForStatement } from "../ast/node/ForStatement.ts";
import type { DoStatement } from "../ast/node/DoStatement.ts";
import type { ClassDeclaration } from "../ast/node/ClassDeclaration.ts";
import { printClassDeclaration } from "./print_class_declaration.ts";
import { printClassDefinition } from "./print_class_definition.ts";
import { printComputedArrayDefinition } from "./print_computed_array_definition.ts";
import { printMapDeclaration } from "./print_map_declaration.ts";
import { printStringDefinition } from "./print_string_definition.ts";
import { printMapDefinition } from "./print_map_definition.ts";
import { printComputedElementaryTypeDefinition } from "./print_computed_elementary_type_definition.ts";
import { printElementaryTypeDefinition } from "./print_elementary_type_definition.ts";

const { fill } = doc.builders;

function printCompoundStatement(
  path: AstPath<CompoundStatement>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const compoundStatement = path.node;

  const docs: Doc = [];

  const statementDocs = path.map(print, "statements");

  addIndentedBlock(
    docs,
    statementDocs,
    compoundStatement.openBracePunctuator,
    compoundStatement.closeBracePunctuator,
  );

  return docs;
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
      throw new Error(
        "Unreachable code reached, statementKind == " + exhaustiveCheck,
      );
    }
  }
}
