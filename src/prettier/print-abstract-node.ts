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
  addTrailingTriviaDoc,
  endsWithHardline,
  getLeadingTriviaDoc,
  getTrailingTriviaDoc,
  removeLeadingBlanklines,
  removeTrailingHardline,
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
import { StatementKind } from "../ast/node/enum/statement-kind.ts";
import { InternalParseError } from "../parse-error.ts";

export function printAbstractNode(
  path: AstPath<RequiredNode<AbstractNode>>,
  _options: ParserOptions<AbstractNode>,
  print: (_path: AstPath<RequiredNode<AbstractNode>>) => Doc,
): Doc {
  const node = path.node;
  const nodeKind = node.nodeKind;

  let doc: Doc = [];

  let leadingTriviaDoc = getLeadingTriviaDoc(node);

  if (leadingTriviaDoc) {
    // prevent extra lines at beginning of compount statement
    if (
      (nodeKind === NodeKind.STATEMENT) &&
      ((node as AbstractStatement).statementKind === StatementKind.COMPOUND)
    ) {
      leadingTriviaDoc = removeLeadingBlanklines(leadingTriviaDoc);
    }
    doc.push(leadingTriviaDoc);
  }

  switch (nodeKind) {
    case NodeKind.AGGREGATE_OUTPUT_VALUE:
      doc.push(printAggregateOutputValue(
        path as AstPath<AggregateOutputValue>,
        print,
      ));
      break;
    case NodeKind.ALIGNED_MODIFIER:
      doc.push(printAlignedModifier(path as AstPath<AlignedModifier>, print));
      break;
    case NodeKind.ARRAY_DIMENSION:
      doc.push(printAbstractArrayDimension(
        path as AstPath<AbstractArrayDimension>,
        print,
      ));
      break;
    case NodeKind.ARRAY_ELEMENT_ACCESS:
      doc.push(printArrayElementAccess(
        path as AstPath<ArrayElementAccess>,
        print,
      ));
      break;
    case NodeKind.BIT_MODIFIER:
      doc.push(printBitModifier(path as AstPath<BitModifier>, print));
      break;
    case NodeKind.CASE_CLAUSE:
      doc.push(printCaseClause(path as AstPath<CaseClause>, print));
      break;
    case NodeKind.CLASS_ID:
      doc.push(printAbstractClassId(path as AstPath<AbstractClassId>, print));
      break;
    case NodeKind.CLASS_MEMBER_ACCESS:
      doc.push(
        printClassMemberAccess(path as AstPath<ClassMemberAccess>, print),
      );
      break;
    case NodeKind.DEFAULT_CLAUSE:
      doc.push(printDefaultClause(
        path as AstPath<DefaultClause>,
        print,
      ));
      break;
    case NodeKind.ELEMENTARY_TYPE:
      doc.push(printElementaryType(path as AstPath<ElementaryType>, print));
      break;
    case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
      doc.push(printElementaryTypeOutputValue(
        path as AstPath<ElementaryTypeOutputValue>,
        print,
      ));
      break;
    case NodeKind.EXPRESSION:
      doc.push(printAbstractExpression(
        path as AstPath<AbstractExpression>,
        print,
      ));
      break;
    case NodeKind.EXPANDABLE_MODIFIER:
      doc.push(printExpandableModifier(
        path as AstPath<ExpandableModifier>,
        print,
      ));
      break;
    case NodeKind.EXTENDS_MODIFIER:
      doc.push(printExtendsModifier(path as AstPath<ExtendsModifier>, print));
      break;
    case NodeKind.IDENTIFIER:
      doc.push(printIdentifier(path as AstPath<Identifier>, print));
      break;
    case NodeKind.LENGTH_ATTRIBUTE:
      doc.push(printLengthAttribute(path as AstPath<LengthAttribute>, print));
      break;
    case NodeKind.MAP_ENTRY:
      doc.push(printMapEntry(path as AstPath<MapEntry>, print));
      break;
    case NodeKind.NUMBER_LITERAL:
      doc.push(printNumberLiteral(path as AstPath<NumberLiteral>, print));
      break;
    case NodeKind.PARAMETER:
      doc.push(printParameter(path as AstPath<Parameter>, print));
      break;
    case NodeKind.PARAMETER_LIST:
      doc.push(printParameterList(path as AstPath<ParameterList>, print));
      break;
    case NodeKind.PARAMETER_VALUE_LIST:
      doc.push(printParameterValueList(
        path as AstPath<ParameterValueList>,
        print,
      ));
      break;
    case NodeKind.SPECIFICATION:
      doc.push(printSpecification(path as AstPath<Specification>, print));
      break;
    case NodeKind.STATEMENT:
      doc.push(
        printAbstractStatement(path as AstPath<AbstractStatement>, print),
      );
      break;
    case NodeKind.STRING_LITERAL:
      doc.push(printStringLiteral(path as AstPath<StringLiteral>, print));
      break;
    case NodeKind.TOKEN:
      doc.push(printToken(path as AstPath<Token>));
      break;
    case NodeKind.UNEXPECTED_ERROR:
      doc.push(printUnexpectedError(path as AstPath<UnexpectedError>, print));
      break;
    default: {
      const exhaustiveCheck: never = nodeKind;
      throw new InternalParseError(
        "Unreachable code reached, nodeKind == " + exhaustiveCheck,
      );
    }
  }

  const trailingTriviaDoc = getTrailingTriviaDoc(node);

  if (trailingTriviaDoc) {
    // prevent extra lines at end of specification
    if (
      (nodeKind === NodeKind.SPECIFICATION) && endsWithHardline(doc) &&
      endsWithHardline(trailingTriviaDoc)
    ) {
      doc = removeTrailingHardline(doc);
    }
    doc = addTrailingTriviaDoc(doc, trailingTriviaDoc);
  }

  // trim unneeded arrays
  while (Array.isArray(doc) && (doc.length === 1)) {
    doc = doc[0];
  }

  return doc;
}
