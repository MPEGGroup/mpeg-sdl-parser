import type { AstPath, Doc, ParserOptions } from "prettier";
import {
  printAbstractExpression,
  printArrayElementAccess,
  printClassMemberAccess,
} from "./print_expression.ts";
import {
  printAggregateOutputValue,
  printElementaryTypeOutputValue,
  printMapEntry,
} from "./print_map.ts";
import {
  printBitModifier,
  printClassId,
  printExpandableModifier,
  printExtendsModifier,
  printParameter,
  printParameterList,
  printParameterValueList,
} from "./print_class.ts";
import { printSpecification } from "./print_specification.ts";
import { printAbstractArrayDimension } from "./print_array.ts";
import {
  printAlignedModifier,
  printIdentifier,
  printLengthAttribute,
  printNumberLiteral,
} from "./print_common.ts";
import { printElementaryType } from "./print_elementary_type.ts";
import { printStringLiteral } from "./print_string.ts";
import { printStatement } from "./print_statement.ts";
import { printCaseClause, printDefaultClause } from "./print_switch.ts";
import type { AbstractArrayDimension } from "../ast/node/AbstractArrayDimension.ts";
import type { AbstractClassId } from "../ast/node/AbstractClassId.ts";
import type { AbstractExpression } from "../ast/node/AbstractExpression.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { AbstractStatement } from "../ast/node/AbstractStatement.ts";
import type { AlignedModifier } from "../ast/node/AlignedModifier.ts";
import type { ArrayElementAccess } from "../ast/node/ArrayElementAccess.ts";
import type { BitModifier } from "../ast/node/BitModifier.ts";
import type { ClassMemberAccess } from "../ast/node/ClassMemberAccess.ts";
import type { ElementaryType } from "../ast/node/ElementaryType.ts";
import { NodeKind } from "../ast/node/enum/node_kind.ts";
import type { ExpandableModifier } from "../ast/node/ExpandableModifier.ts";
import type { ExtendsModifier } from "../ast/node/ExtendsModifier.ts";
import type { LengthAttribute } from "../ast/node/LengthAttribute.ts";
import type { MapEntry } from "../ast/node/MapEntry.ts";
import type { NumberLiteral } from "../ast/node/NumberLiteral.ts";
import type { Parameter } from "../ast/node/Parameter.ts";
import type { ParameterList } from "../ast/node/ParameterList.ts";
import type { ParameterValueList } from "../ast/node/ParameterValueList.ts";
import type { Specification } from "../ast/node/Specification.ts";
import type { CaseClause } from "../ast/node/CaseClause.ts";
import type { DefaultClause } from "../ast/node/DefaultClause.ts";
import type { Identifier } from "../ast/node/Identifier.ts";
import type { StringLiteral } from "../ast/node/StringLiteral.ts";
import type { AggregateOutputValue } from "../ast/node/AggregateOutputValue.ts";
import type { ElementaryTypeOutputValue } from "../ast/node/ElementaryTypeOutputValue.ts";

export function printNode(
  path: AstPath<AbstractNode>,
  _options: ParserOptions<AbstractNode>,
  print: (_path: AstPath<AbstractNode>) => Doc,
): Doc {
  const node = path.node;
  const nodeKind = node.nodeKind;

  switch (nodeKind) {
    case NodeKind.AGGREGATE_OUTPUT_VALUE:
      return printAggregateOutputValue(
        path as AstPath<AggregateOutputValue>,
        print,
      );
    case NodeKind.ALIGNED_MODIFIER:
      return printAlignedModifier(path as AstPath<AlignedModifier>);
    case NodeKind.ARRAY_DIMENSION:
      return printAbstractArrayDimension(
        path as AstPath<AbstractArrayDimension>,
        print,
      );
    case NodeKind.ARRAY_ELEMENT_ACCESS:
      return printArrayElementAccess(
        path as AstPath<ArrayElementAccess>,
        print,
      );
    case NodeKind.BIT_MODIFIER:
      return printBitModifier(path as AstPath<BitModifier>, print);
    case NodeKind.CASE_CLAUSE:
      return printCaseClause(path as AstPath<CaseClause>, print);
    case NodeKind.CLASS_ID:
      return printClassId(path as AstPath<AbstractClassId>, print);
    case NodeKind.CLASS_MEMBER_ACCESS:
      return printClassMemberAccess(path as AstPath<ClassMemberAccess>, print);
    case NodeKind.DEFAULT_CLAUSE:
      return printDefaultClause(
        path as AstPath<DefaultClause>,
        print,
      );
    case NodeKind.ELEMENTARY_TYPE:
      return printElementaryType(path as AstPath<ElementaryType>);
    case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
      return printElementaryTypeOutputValue(
        path as AstPath<ElementaryTypeOutputValue>,
        print,
      );
    case NodeKind.EXPRESSION:
      return printAbstractExpression(
        path as AstPath<AbstractExpression>,
        print,
      );
    case NodeKind.EXPANDABLE_MODIFIER:
      return printExpandableModifier(
        path as AstPath<ExpandableModifier>,
        print,
      );
    case NodeKind.EXTENDS_MODIFIER:
      return printExtendsModifier(path as AstPath<ExtendsModifier>, print);
    case NodeKind.IDENTIFIER:
      return printIdentifier(path as AstPath<Identifier>);
    case NodeKind.LENGTH_ATTRIBUTE:
      return printLengthAttribute(path as AstPath<LengthAttribute>, print);
    case NodeKind.MAP_ENTRY:
      return printMapEntry(path as AstPath<MapEntry>, print);
    case NodeKind.NUMBER_LITERAL:
      return printNumberLiteral(path as AstPath<NumberLiteral>);
    case NodeKind.PARAMETER:
      return printParameter(path as AstPath<Parameter>, print);
    case NodeKind.PARAMETER_LIST:
      return printParameterList(path as AstPath<ParameterList>, print);
    case NodeKind.PARAMETER_VALUE_LIST:
      return printParameterValueList(
        path as AstPath<ParameterValueList>,
        print,
      );
    case NodeKind.SPECIFICATION:
      return printSpecification(path as AstPath<Specification>, print);
    case NodeKind.STATEMENT:
      return printStatement(path as AstPath<AbstractStatement>, print);
    case NodeKind.STRING_LITERAL:
      return printStringLiteral(path as AstPath<StringLiteral>);
    default: {
      const exhaustiveCheck: never = nodeKind;
      throw new Error(
        "Unreachable code reached, nodeKind == " + exhaustiveCheck,
      );
    }
  }
}
