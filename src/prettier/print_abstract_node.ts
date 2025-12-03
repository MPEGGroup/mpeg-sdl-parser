import { type AstPath, type Doc, doc, type ParserOptions } from "prettier";
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
import type { Token } from "../ast/node/Token.ts";
import type { UnexpectedError } from "../ast/node/UnexpectedError.ts";
import type { RequiredNode } from "../ast/util/types.ts";
import { NodeKind } from "../ast/node/enum/node_kind.ts";
import { printAbstractExpression } from "./print_abstract_expression.ts";
import { printMapEntry } from "./print_map_entry.ts";
import { printSpecification } from "./print_specification.ts";
import { printElementaryType } from "./print_elementary_type.ts";
import { printStringLiteral } from "./print_string_literal.ts";
import { printAbstractStatement } from "./print_abstract_statement.ts";
import { addTrivia } from "./print_utils.ts";
import { printUnexpectedError } from "./print_unexpected_error.ts";
import { printAlignedModifier } from "./print_aligned_modifier.ts";
import { printIdentifier } from "./print_identifier.ts";
import { printLengthAttribute } from "./print_length_attribute.ts";
import { printNumberLiteral } from "./print_number_literal.ts";
import { printBitModifier } from "./print_bit_modifier.ts";
import { printAbstractClassId } from "./print_abstract_class_id.ts";
import { printExpandableModifier } from "./print_expandable_modifier.ts";
import { printExtendsModifier } from "./print_extends_modifier.ts";
import { printParameter } from "./print_parameter.ts";
import { printParameterList } from "./print_parameter_list.ts";
import { printParameterValueList } from "./print_parameter_value_list.ts";
import { printArrayElementAccess } from "./print_array_element_access.ts";
import { printClassMemberAccess } from "./print_class_member_access.ts";
import { printAggregateOutputValue } from "./print_aggregate_output_value.ts";
import { printElementaryTypeOutputValue } from "./print_elementary_type_output_value.ts";
import { printAbstractArrayDimension } from "./print_abstract_array_dimension.ts";
import { printCaseClause } from "./print_case_clause.ts";
import { printDefaultClause } from "./print_default_clause.ts";
import { printToken } from "./print_token.ts";

const { hardline, ifBreak, line } = doc.builders;

export function printAbstractNode(
  path: AstPath<RequiredNode<AbstractNode>>,
  _options: ParserOptions<AbstractNode>,
  print: (_path: AstPath<RequiredNode<AbstractNode>>) => Doc,
): Doc {
  const node = path.node;
  const nodeKind = node.nodeKind;

  const docs: Doc = [];

  if (node.leadingTrivia && (node.leadingTrivia.length > 0)) {
    node.leadingTrivia.forEach((trivia) => {
      addTrivia(docs, trivia);
      docs.push(hardline);
    });
  }

  switch (nodeKind) {
    case NodeKind.AGGREGATE_OUTPUT_VALUE:
      docs.push(printAggregateOutputValue(
        path as AstPath<AggregateOutputValue>,
        print,
      ));
      break;
    case NodeKind.ALIGNED_MODIFIER:
      docs.push(printAlignedModifier(path as AstPath<AlignedModifier>, print));
      break;
    case NodeKind.ARRAY_DIMENSION:
      docs.push(printAbstractArrayDimension(
        path as AstPath<AbstractArrayDimension>,
        print,
      ));
      break;
    case NodeKind.ARRAY_ELEMENT_ACCESS:
      docs.push(printArrayElementAccess(
        path as AstPath<ArrayElementAccess>,
        print,
      ));
      break;
    case NodeKind.BIT_MODIFIER:
      docs.push(printBitModifier(path as AstPath<BitModifier>, print));
      break;
    case NodeKind.CASE_CLAUSE:
      docs.push(printCaseClause(path as AstPath<CaseClause>, print));
      break;
    case NodeKind.CLASS_ID:
      docs.push(printAbstractClassId(path as AstPath<AbstractClassId>, print));
      break;
    case NodeKind.CLASS_MEMBER_ACCESS:
      docs.push(
        printClassMemberAccess(path as AstPath<ClassMemberAccess>, print),
      );
      break;
    case NodeKind.DEFAULT_CLAUSE:
      docs.push(printDefaultClause(
        path as AstPath<DefaultClause>,
        print,
      ));
      break;
    case NodeKind.ELEMENTARY_TYPE:
      docs.push(printElementaryType(path as AstPath<ElementaryType>, print));
      break;
    case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
      docs.push(printElementaryTypeOutputValue(
        path as AstPath<ElementaryTypeOutputValue>,
        print,
      ));
      break;
    case NodeKind.EXPRESSION:
      docs.push(printAbstractExpression(
        path as AstPath<AbstractExpression>,
        print,
      ));
      break;
    case NodeKind.EXPANDABLE_MODIFIER:
      docs.push(printExpandableModifier(
        path as AstPath<ExpandableModifier>,
        print,
      ));
      break;
    case NodeKind.EXTENDS_MODIFIER:
      docs.push(printExtendsModifier(path as AstPath<ExtendsModifier>, print));
      break;
    case NodeKind.IDENTIFIER:
      docs.push(printIdentifier(path as AstPath<Identifier>, print));
      break;
    case NodeKind.LENGTH_ATTRIBUTE:
      docs.push(printLengthAttribute(path as AstPath<LengthAttribute>, print));
      break;
    case NodeKind.MAP_ENTRY:
      docs.push(printMapEntry(path as AstPath<MapEntry>, print));
      break;
    case NodeKind.MISSING_ERROR:
      // nothing to do here
      break;
    case NodeKind.NUMBER_LITERAL:
      docs.push(printNumberLiteral(path as AstPath<NumberLiteral>, print));
      break;
    case NodeKind.PARAMETER:
      docs.push(printParameter(path as AstPath<Parameter>, print));
      break;
    case NodeKind.PARAMETER_LIST:
      docs.push(printParameterList(path as AstPath<ParameterList>, print));
      break;
    case NodeKind.PARAMETER_VALUE_LIST:
      docs.push(printParameterValueList(
        path as AstPath<ParameterValueList>,
        print,
      ));
      break;
    case NodeKind.SPECIFICATION:
      docs.push(printSpecification(path as AstPath<Specification>, print));
      break;
    case NodeKind.STATEMENT:
      docs.push(
        printAbstractStatement(path as AstPath<AbstractStatement>, print),
      );
      break;
    case NodeKind.STRING_LITERAL:
      docs.push(printStringLiteral(path as AstPath<StringLiteral>, print));
      break;
    case NodeKind.TOKEN:
      docs.push(printToken(path as AstPath<Token>));
      break;
    case NodeKind.UNEXPECTED_ERROR:
      docs.push(printUnexpectedError(path as AstPath<UnexpectedError>, print));
      break;
    default: {
      const exhaustiveCheck: never = nodeKind;
      throw new Error(
        "Unreachable code reached, nodeKind == " + exhaustiveCheck,
      );
    }
  }

  if (node.trailingTrivia && (node.trailingTrivia.length > 0)) {
    docs.push(ifBreak([line, "  "], " "));
    node.trailingTrivia.forEach((trivia) => {
      addTrivia(docs, trivia);
      docs.push(hardline);
    });
  }

  return docs;
}
