import { type AstPath, type Doc, type ParserOptions } from "prettier";
import type { AbstractArrayDimension } from "../ast/node/abstract-array-dimension.ts";
import type { AbstractClassId } from "../ast/node/abstract-class-id.ts";
import type { AbstractExpression } from "../ast/node/abstract-expression.ts";
import type { AbstractNode } from "../ast/node/abstract-node.ts";
import type { AbstractStatement } from "../ast/node/abstract-statement.ts";
import type { AlignedModifier } from "../ast/node/aligned-modifier.ts";
import type { ArrayElementAccess } from "../ast/node/array-element-access.ts";
import type { BitModifier } from "../ast/node/bit-modifier.ts";
import type { ClassMemberAccess } from "../ast/node/class-member-access.ts";
import type { ElementaryType } from "../ast/node/elementary-type.ts";
import type { ExpandableModifier } from "../ast/node/expandable-modifier.ts";
import type { ExtendsModifier } from "../ast/node/extends-modifier.ts";
import type { LengthAttribute } from "../ast/node/length-attribute.ts";
import type { MapEntry } from "../ast/node/map-entry.ts";
import type { NumberLiteral } from "../ast/node/number-literal.ts";
import type { Parameter } from "../ast/node/parameter.ts";
import type { ParameterList } from "../ast/node/parameter-list.ts";
import type { ParameterValueList } from "../ast/node/parameter-value-list.ts";
import type { Specification } from "../ast/node/specification.ts";
import type { CaseClause } from "../ast/node/case-clause.ts";
import type { DefaultClause } from "../ast/node/default-clause.ts";
import type { Identifier } from "../ast/node/identifier.ts";
import type { StringLiteral } from "../ast/node/string-literal.ts";
import type { AggregateOutputValue } from "../ast/node/aggregate-output-value.ts";
import type { ElementaryTypeOutputValue } from "../ast/node/elementary-type-output-value.ts";
import type { Token } from "../ast/node/token.ts";
import type { UnexpectedError } from "../ast/node/unexpected-error.ts";
import type { RequiredNode } from "../ast/util/types.ts";
import { NodeKind } from "../ast/node/enum/node-kind.ts";
import { printAbstractExpression } from "./print-abstract-expression.ts";
import { printMapEntry } from "./print-map-entry.ts";
import { printSpecification } from "./print-specification.ts";
import { printElementaryType } from "./print-elementary-type.ts";
import { printStringLiteral } from "./print-string-literal.ts";
import { printAbstractStatement } from "./print-abstract-statement.ts";
import {
  getLeadingTriviaDoc,
  getTrailingTriviaDoc,
} from "./util/print-utils.ts";
import { printUnexpectedError } from "./print-unexpected-error.ts";
import { printAlignedModifier } from "./print-aligned-modifier.ts";
import { printIdentifier } from "./print-identifier.ts";
import { printLengthAttribute } from "./print-length-attribute.ts";
import { printNumberLiteral } from "./print-number-literal.ts";
import { printBitModifier } from "./print-bit-modifier.ts";
import { printAbstractClassId } from "./print-abstract-class-id.ts";
import { printExpandableModifier } from "./print-expandable-modifier.ts";
import { printExtendsModifier } from "./print-extends-modifier.ts";
import { printParameter } from "./print-parameter.ts";
import { printParameterList } from "./print-parameter-list.ts";
import { printParameterValueList } from "./print-parameter-value-list.ts";
import { printArrayElementAccess } from "./print-array-element-access.ts";
import { printClassMemberAccess } from "./print-class-member-access.ts";
import { printAggregateOutputValue } from "./print-aggregate-output-value.ts";
import { printElementaryTypeOutputValue } from "./print-elementary-type-output-value.ts";
import { printAbstractArrayDimension } from "./print-abstract-array-dimension.ts";
import { printCaseClause } from "./print-case-clause.ts";
import { printDefaultClause } from "./print-default-clause.ts";
import { printToken } from "./print-token.ts";

export function printAbstractNode(
  path: AstPath<RequiredNode<AbstractNode>>,
  _options: ParserOptions<AbstractNode>,
  print: (_path: AstPath<RequiredNode<AbstractNode>>) => Doc,
): Doc {
  const node = path.node;
  const nodeKind = node.nodeKind;

  const docs = getLeadingTriviaDoc(node);

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

  docs.push(...getTrailingTriviaDoc(node));

  return docs;
}
