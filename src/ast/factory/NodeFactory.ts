import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { AbstractNode } from "../node/AbstractNode.ts";
import { SyntacticParseError } from "../../ParseError.ts";
import { getSpecification } from "./getSpecification.ts";
import { getComputedElementaryTypeDefinition } from "./getComputedElementaryTypeDefinition.ts";
import { getElementaryType } from "./getElementaryType.ts";
import { getLengthAttribute } from "./getLengthAttribute.ts";
import { getIdentifier } from "./getIdentifier.ts";
import { getClassDeclaration } from "./getClassDeclaration.ts";
import { getElementaryTypeDefinition } from "./getElementaryTypeDefinition.ts";
import { getUnaryExpression } from "./getUnaryExpression.ts";
import { getBinaryLiteral } from "./getBinaryLiteral.ts";
import { getDecimalLiteral } from "./getDecimalLiteral.ts";
import { getFloatingPointLiteral } from "./getFloatingPointLiteral.ts";
import { getMultipleCharacterLiteral } from "./getMultipleCharacterLiteral.ts";
import { getHexadecimalLiteral } from "./getHexadecimalLiteral.ts";
import { getIntegerLiteral } from "./getIntegerLiteral.ts";
import { getIfStatement } from "./getIfStatement.ts";
import { getBinaryExpression } from "./getBinaryExpression.ts";
import { getCompoundStatement } from "./getCompoundStatement.ts";
import { getClassDefinition } from "./getClassDefinition.ts";
import { getExpressionStatement } from "./getExpressionStatement.ts";
import { getAssignmentExpression } from "./getAssignmentExpression.ts";
import { getClassMemberAccess } from "./getClassMemberAccess.ts";
import { getArrayElementAccess } from "./getArrayElementAccess.ts";
import { getArrayDefinition } from "./getArrayDefinition.ts";
import { getExplicitArrayDimension } from "./getExplicitArrayDimension.ts";
import { getImplicitArrayDimension } from "./getImplicitArrayDimension.ts";
import { getPartialArrayDimension } from "./getPartialArrayDimension.ts";
import { getAlignedModifier } from "./getAlignedModifier.ts";
import { getAlignmentBitCount } from "./getAlignmentBitCount.ts";
import { getStringDefinition } from "./getStringDefinition.ts";
import { getUtfStringLiteral } from "./getUtfStringLiteral.ts";
import { getBase64StringLiteral } from "./getBase64StringLiteral.ts";
import { getLengthofExpression } from "./getLengthofExpression.ts";
import { getMapDeclaration } from "./getMapDeclaration.ts";
import { getMapEntry } from "./getMapEntry.ts";
import { getAggregateOutputValue } from "./getAggegateOutputValue.ts";
import { getElementaryTypeOutputValue } from "./getElementaryTypeOutputValue.ts";
import { getExpandableModifier } from "./getExpandableModifier.ts";
import { getParameterList } from "./getParameterList.ts";
import { getParameter } from "./getParameter.ts";
import { getExtendsModifier } from "./getExtendsModifier.ts";
import { getParameterValueList } from "./getParameterValueList.ts";
import { getBitModifier } from "./getBitModifier.ts";
import { getClassIdRange } from "./getClassIdRange.ts";
import { getExtendedClassIdRange } from "./getExtendedClassIdRange.ts";
import { getClassId } from "./getClassId.ts";
import { getComputedArrayDefinition } from "./getComputedArrayDefinition.ts";
import { getSwitchStatement } from "./getSwitchStatement.ts";
import { getWhileStatement } from "./getWhileStatement.ts";
import { getForStatement } from "./getForStatement.ts";
import { getDoStatement } from "./getDoStatement.ts";
import { getDefaultClause } from "./getDefaultClause.ts";
import { getCaseClause } from "./getCaseClause.ts";
import {
  AggregateOutputValue,
  AlignedModifier,
  AlignmentBitCount,
  ArrayDefinition,
  ArrayElementAccess,
  AssignmentExpression,
  Base64StringLiteral,
  BinaryExpression,
  BinaryLiteral,
  BitModifier,
  CaseClause,
  ClassDeclaration,
  ClassDefinition,
  ClassId,
  ClassIdRange,
  ClassMemberAccess,
  CompoundStatement,
  ComputedArrayDefinition,
  ComputedElementaryTypeDefinition,
  DecimalLiteral,
  DefaultClause,
  DoStatement,
  ElementaryType,
  ElementaryTypeDefinition,
  ElementaryTypeOutputValue,
  ExpandableModifier,
  ExplicitArrayDimension,
  ExpressionStatement,
  ExtendedClassIdRange,
  ExtendsModifier,
  FloatingPointLiteral,
  ForStatement,
  HexadecimalLiteral,
  Identifier,
  IfStatement,
  ImplicitArrayDimension,
  IntegerLiteral,
  LengthAttribute,
  LengthofExpression,
  MapDeclaration,
  MapEntry,
  MultipleCharacterLiteral,
  Parameter,
  ParameterList,
  ParameterValueList,
  PartialArrayDimension,
  Specification,
  StringDefinition,
  SwitchStatement,
  UnaryExpression,
  UtfStringLiteral,
  WhileStatement,
} from "../../lezer/parser.terms.ts";

export class NodeFactory {
  static createNode(cursor: TreeCursor, text: Text): AbstractNode {
    if (cursor.type.isError) {
      throw SyntacticParseError.fromTextAndCursor(text, cursor);
    }

    switch (cursor.type.id) {
      case AggregateOutputValue:
        return getAggregateOutputValue(cursor, text);
      case AlignedModifier:
        return getAlignedModifier(cursor, text);
      case AlignmentBitCount:
        return getAlignmentBitCount(cursor, text);
      case ArrayDefinition:
        return getArrayDefinition(cursor, text);
      case ArrayElementAccess:
        return getArrayElementAccess(cursor, text);
      case AssignmentExpression:
        return getAssignmentExpression(cursor, text);
      case Base64StringLiteral:
        return getBase64StringLiteral(cursor, text);
      case BinaryExpression:
        return getBinaryExpression(cursor, text);
      case BinaryLiteral:
        return getBinaryLiteral(cursor, text);
      case BitModifier:
        return getBitModifier(cursor, text);
      case CaseClause:
        return getCaseClause(cursor, text);
      case ClassDeclaration:
        return getClassDeclaration(cursor, text);
      case ClassDefinition:
        return getClassDefinition(cursor, text);
      case ClassId:
        return getClassId(cursor, text);
      case ClassIdRange:
        return getClassIdRange(cursor, text);
      case ClassMemberAccess:
        return getClassMemberAccess(cursor, text);
      case CompoundStatement:
        return getCompoundStatement(cursor, text);
      case ComputedArrayDefinition:
        return getComputedArrayDefinition(cursor, text);
      case ComputedElementaryTypeDefinition:
        return getComputedElementaryTypeDefinition(cursor, text);
      case DecimalLiteral:
        return getDecimalLiteral(cursor, text);
      case DefaultClause:
        return getDefaultClause(cursor, text);
      case DoStatement:
        return getDoStatement(cursor, text);
      case ElementaryType:
        return getElementaryType(cursor, text);
      case ElementaryTypeDefinition:
        return getElementaryTypeDefinition(cursor, text);
      case ElementaryTypeOutputValue:
        return getElementaryTypeOutputValue(cursor, text);
      case ExpandableModifier:
        return getExpandableModifier(cursor, text);
      case ExplicitArrayDimension:
        return getExplicitArrayDimension(cursor, text);
      case ExpressionStatement:
        return getExpressionStatement(cursor, text);
      case ExtendedClassIdRange:
        return getExtendedClassIdRange(cursor, text);
      case ExtendsModifier:
        return getExtendsModifier(cursor, text);
      case FloatingPointLiteral:
        return getFloatingPointLiteral(cursor, text);
      case ForStatement:
        return getForStatement(cursor, text);
      case HexadecimalLiteral:
        return getHexadecimalLiteral(cursor, text);
      case Identifier:
        return getIdentifier(cursor, text);
      case IfStatement:
        return getIfStatement(cursor, text);
      case ImplicitArrayDimension:
        return getImplicitArrayDimension(cursor, text);
      case IntegerLiteral:
        return getIntegerLiteral(cursor, text);
      case LengthAttribute:
        return getLengthAttribute(cursor, text);
      case LengthofExpression:
        return getLengthofExpression(cursor, text);
      case MapDeclaration:
        return getMapDeclaration(cursor, text);
      case MapEntry:
        return getMapEntry(cursor, text);
      case MultipleCharacterLiteral:
        return getMultipleCharacterLiteral(cursor, text);
      case Parameter:
        return getParameter(cursor, text);
      case ParameterList:
        return getParameterList(cursor, text);
      case ParameterValueList:
        return getParameterValueList(cursor, text);
      case PartialArrayDimension:
        return getPartialArrayDimension(cursor, text);
      case Specification:
        return getSpecification(cursor, text);
      case StringDefinition:
        return getStringDefinition(cursor, text);
      case SwitchStatement:
        return getSwitchStatement(cursor, text);
      case UtfStringLiteral:
        return getUtfStringLiteral(cursor, text);
      case UnaryExpression:
        return getUnaryExpression(cursor, text);
      case WhileStatement:
        return getWhileStatement(cursor, text);
      default:
        throw new Error(
          `Unsupported node type: ${cursor.type.name}`,
        );
    }
  }
}
