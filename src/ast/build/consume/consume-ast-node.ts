import getLogger from "../../../util/logger.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";
import { buildAggregateOutputValue } from "../node/build-aggregate-output-value.ts";
import { buildAlignedModifier } from "../node/build-aligned-modifier.ts";
import { buildArrayDefinition } from "../node/build-array-definition.ts";
import { buildArrayElementAccess } from "../node/build-array-element-access.ts";
import { buildBase64StringLiteral } from "../node/build-base64-string-literal.ts";
import { buildBinaryExpression } from "../node/build-binary-expression.ts";
import { buildBitModifier } from "../node/build-bit-modifier.ts";
import { buildCaseClause } from "../node/build-case-clause.ts";
import { buildClassDeclaration } from "../node/build-class-declaration.ts";
import { buildClassDefinition } from "../node/build-class-definition.ts";
import { buildClassIdRange } from "../node/build-class-id-range.ts";
import { buildClassId } from "../node/build-class-id.ts";
import { buildClassMemberAccess } from "../node/build-class-member-access.ts";
import { buildCompoundStatement } from "../node/build-compound-statement.ts";
import { buildComputedArrayDefinition } from "../node/build-computed-array-definition.ts";
import { buildComputedElementaryTypeDefinition } from "../node/build-computed-elementary-type-definition.ts";
import { buildDefaultClause } from "../node/build-default-clause.ts";
import { buildDoStatement } from "../node/build-do-statement.ts";
import { buildElementaryTypeDefinition } from "../node/build-elementary-type-definition.ts";
import { buildElementaryTypeOutputValue } from "../node/build-elementary-type-output-value.ts";
import { buildElementaryType } from "../node/build-elementary-type.ts";
import { buildExpandableModifier } from "../node/build-expandable-modifier.ts";
import { buildExplicitArrayDimension } from "../node/build-explicit-array-dimension.ts";
import { buildExpressionStatement } from "../node/build-expression-statement.ts";
import { buildExtendedClassIdRange } from "../node/build-extended-class-id-range.ts";
import { buildExtendsModifier } from "../node/build-extends-modifier.ts";
import { buildForStatement } from "../node/build-for-statement.ts";
import { buildIfStatement } from "../node/build-if-statement.ts";
import { buildImplicitArrayDimension } from "../node/build-implicit-array-dimension.ts";
import { buildLengthAttribute } from "../node/build-length-attribute.ts";
import { buildLengthofExpression } from "../node/build-lengthof-expression.ts";
import { buildMapDeclaration } from "../node/build-map-declaration.ts";
import { buildMapEntry } from "../node/build-map-entry.ts";
import { buildMultipleCharacterLiteral } from "../node/build-multiple-character-literal.ts";
import { buildParameterList } from "../node/build-parameter-list.ts";
import { buildParameterValueList } from "../node/build-parameter-value-list.ts";
import { buildParameter } from "../node/build-parameter.ts";
import { buildPartialArrayDimension } from "../node/build-partial-array-dimension.ts";
import { buildSpecification } from "../node/build-specification.ts";
import { buildStringDefinition } from "../node/build-string-definition.ts";
import { buildSwitchStatement } from "../node/build-switch-statement.ts";
import { buildUnaryExpression } from "../node/build-unary-expression.ts";
import { buildUtfStringLiteral } from "../node/build-utf-string-literal.ts";
import { buildWhileStatement } from "../node/build-while-statement.ts";
import { InternalParseError } from "../../../parse-error.ts";
import { NodeKind } from "../../node/enum/node-kind.ts";
import { buildUnexpectedError } from "../node/build-unexpected-error.ts";
import type { BuildContext } from "../util/build-context.ts";
import { nodeKindByTokenTypeId } from "../util/node-kind-by-token-type-id-map.ts";
import { ArrayDimensionKind } from "../../node/enum/array-dimension-kind.ts";
import { arrayDimensionKindByTokenTypeId } from "../util/array-dimension-kind-by-token-type-id-map.ts";
import { stringLiteralKindByTokenTypeId } from "../util/string-literal-kind-by-token-type-id-map.ts";
import { statementKindByTokenTypeId } from "../util/statement-kind-by-token-type-id-map.ts";
import { expressionKindByTokenTypeId } from "../util/expression-kind-by-token-type-id-map.ts";
import { classIdKindByTokenTypeId } from "../util/class-id-kind-by-token-type-id-map.ts";
import { ClassIdKind } from "../../node/enum/class-id-kind.ts";
import { ExpressionKind } from "../../node/enum/expression-kind.ts";
import { StatementKind } from "../../node/enum/statement-kind.ts";
import { buildMapDefinition } from "../node/build-map-definition.ts";
import { StringLiteralKind } from "../../node/enum/string-literal-kind.ts";
import { consumeWhiteSpaceAndMissingErrors } from "./consume-white-space-and-missing-errors.ts";

const logger = getLogger("consumeAstNode");

function consumeArrayDimension(
  buildContext: BuildContext,
  parentTypeId: number,
  parentTypeName: string,
): AbstractNode {
  const arrayDimensionKind = arrayDimensionKindByTokenTypeId.get(
    parentTypeId,
  );

  if (arrayDimensionKind === undefined) {
    throw new InternalParseError(
      `No arrayDimensionKind mapping found for token type id: ${parentTypeId} (${parentTypeName})`,
    );
  }

  switch (arrayDimensionKind) {
    case ArrayDimensionKind.EXPLICIT:
      return buildExplicitArrayDimension(buildContext);
    case ArrayDimensionKind.IMPLICIT:
      return buildImplicitArrayDimension(buildContext);
    case ArrayDimensionKind.PARTIAL:
      return buildPartialArrayDimension(buildContext);
    default: {
      const exhaustiveCheck: never = arrayDimensionKind;
      throw new InternalParseError(
        "Unreachable code reached, arrayDimensionKind == " +
          exhaustiveCheck,
      );
    }
  }
}

function consumeClassId(
  buildContext: BuildContext,
  parentTypeId: number,
  parentTypeName: string,
): AbstractNode {
  const classIdKind = classIdKindByTokenTypeId.get(
    parentTypeId,
  );

  if (classIdKind === undefined) {
    throw new InternalParseError(
      `No classIdKind mapping found for token type id: ${parentTypeId} (${parentTypeName})`,
    );
  }
  switch (classIdKind) {
    case ClassIdKind.SINGLE:
      return buildClassId(buildContext);
    case ClassIdKind.RANGE:
      return buildClassIdRange(buildContext);
    case ClassIdKind.EXTENDED_RANGE:
      return buildExtendedClassIdRange(buildContext);
    default: {
      const exhaustiveCheck: never = classIdKind;
      throw new InternalParseError(
        "Unreachable code reached, classIdKind == " +
          exhaustiveCheck,
      );
    }
  }
}

function consumeExpression(
  buildContext: BuildContext,
  parentTypeId: number,
  parentTypeName: string,
): AbstractNode {
  const expressionKind = expressionKindByTokenTypeId.get(
    parentTypeId,
  );

  if (expressionKind === undefined) {
    throw new InternalParseError(
      `No expressionKind mapping found for token type id: ${parentTypeId} (${parentTypeName})`,
    );
  }
  switch (expressionKind) {
    case ExpressionKind.BINARY:
      return buildBinaryExpression(buildContext);
    case ExpressionKind.UNARY:
      return buildUnaryExpression(buildContext);
    case ExpressionKind.LENGTHOF:
      return buildLengthofExpression(buildContext);
    default: {
      const exhaustiveCheck: never = expressionKind;
      throw new InternalParseError(
        "Unreachable code reached, expressionKind == " +
          exhaustiveCheck,
      );
    }
  }
}

function consumeStatement(
  buildContext: BuildContext,
  parentTypeId: number,
  parentTypeName: string,
): AbstractNode {
  const statementKind = statementKindByTokenTypeId.get(
    parentTypeId,
  );

  if (statementKind === undefined) {
    throw new InternalParseError(
      `No statementKind mapping found for token type id: ${parentTypeId} (${parentTypeName})`,
    );
  }
  switch (statementKind) {
    case StatementKind.ARRAY_DEFINITION:
      return buildArrayDefinition(buildContext);
    case StatementKind.CLASS_DECLARATION:
      return buildClassDeclaration(buildContext);
    case StatementKind.CLASS_DEFINITION:
      return buildClassDefinition(buildContext);
    case StatementKind.COMPOUND:
      return buildCompoundStatement(buildContext);
    case StatementKind.COMPUTED_ARRAY_DEFINITION:
      return buildComputedArrayDefinition(buildContext);
    case StatementKind.COMPUTED_ELEMENTARY_TYPE_DEFINITION:
      return buildComputedElementaryTypeDefinition(buildContext);
    case StatementKind.DO:
      return buildDoStatement(buildContext);
    case StatementKind.ELEMENTARY_TYPE_DEFINITION:
      return buildElementaryTypeDefinition(buildContext);
    case StatementKind.EXPRESSION:
      return buildExpressionStatement(buildContext);
    case StatementKind.FOR:
      return buildForStatement(buildContext);
    case StatementKind.IF:
      return buildIfStatement(buildContext);
    case StatementKind.MAP_DECLARATION:
      return buildMapDeclaration(buildContext);
    case StatementKind.MAP_DEFINITION:
      return buildMapDefinition(buildContext);
    case StatementKind.STRING_DEFINITION:
      return buildStringDefinition(buildContext);
    case StatementKind.SWITCH:
      return buildSwitchStatement(buildContext);
    case StatementKind.WHILE:
      return buildWhileStatement(buildContext);
    default: {
      const exhaustiveCheck: never = statementKind;
      throw new InternalParseError(
        "Unreachable code reached, statementKind == " +
          exhaustiveCheck,
      );
    }
  }
}

function consumeStringLiteral(
  buildContext: BuildContext,
  parentTypeId: number,
  parentTypeName: string,
): AbstractNode {
  const stringLiteralKind = stringLiteralKindByTokenTypeId.get(
    parentTypeId,
  );

  if (stringLiteralKind === undefined) {
    throw new InternalParseError(
      `No stringLiteralKind mapping found for token type id: ${parentTypeId} (${parentTypeName})`,
    );
  }
  switch (stringLiteralKind) {
    case StringLiteralKind.BASIC:
      return buildBase64StringLiteral(buildContext);
    case StringLiteralKind.UTF:
      return buildUtfStringLiteral(buildContext);
    default: {
      const exhaustiveCheck: never = stringLiteralKind;
      throw new InternalParseError(
        "Unreachable code reached, stringLiteralKind == " +
          exhaustiveCheck,
      );
    }
  }
}

export function consumeAstNode(buildContext: BuildContext): AbstractNode {
  const { cursor } = buildContext;
  const currentState =
    buildContext.stateStack[buildContext.stateStack.length - 1];
  const parentTypeId = cursor.type.id;
  const parentTypeName = cursor.type.name;

  let nodeKind: NodeKind | undefined;

  if (cursor.type.isError) {
    nodeKind = NodeKind.UNEXPECTED_ERROR;
  } else {
    nodeKind = nodeKindByTokenTypeId.get(parentTypeId);
  }

  if (nodeKind === undefined) {
    throw new InternalParseError(
      `No nodeKind mapping found for token type id: ${parentTypeId} (${parentTypeName})`,
    );
  }

  logger.debug(
    currentState.indent + "consuming AST node: " + NodeKind[nodeKind] + "...",
  );

  const childStack = {
    isEndOfSiblings: false,
    indent: currentState.indent + "  ",
  };

  buildContext.stateStack.push(childStack);

  if (!cursor.firstChild()) {
    throw new InternalParseError(
      `Expected AST node to have children: ${NodeKind[nodeKind]}`,
    );
  }

  let node: AbstractNode;

  switch (nodeKind) {
    case NodeKind.ARRAY_DIMENSION:
      node = consumeArrayDimension(buildContext, parentTypeId, parentTypeName);
      break;
    case NodeKind.CLASS_ID:
      node = consumeClassId(buildContext, parentTypeId, parentTypeName);
      break;
    case NodeKind.EXPRESSION:
      node = consumeExpression(buildContext, parentTypeId, parentTypeName);
      break;
    case NodeKind.STATEMENT:
      node = consumeStatement(buildContext, parentTypeId, parentTypeName);
      break;
    case NodeKind.STRING_LITERAL:
      node = consumeStringLiteral(buildContext, parentTypeId, parentTypeName);
      break;
    case NodeKind.AGGREGATE_OUTPUT_VALUE:
      node = buildAggregateOutputValue(buildContext);
      break;
    case NodeKind.ALIGNED_MODIFIER:
      node = buildAlignedModifier(buildContext);
      break;
    case NodeKind.ARRAY_ELEMENT_ACCESS:
      node = buildArrayElementAccess(buildContext);
      break;
    case NodeKind.BIT_MODIFIER:
      node = buildBitModifier(buildContext);
      break;
    case NodeKind.CASE_CLAUSE:
      node = buildCaseClause(buildContext);
      break;
    case NodeKind.CLASS_MEMBER_ACCESS:
      node = buildClassMemberAccess(buildContext);
      break;
    case NodeKind.DEFAULT_CLAUSE:
      node = buildDefaultClause(buildContext);
      break;
    case NodeKind.ELEMENTARY_TYPE:
      node = buildElementaryType(buildContext);
      break;
    case NodeKind.ELEMENTARY_TYPE_OUTPUT_VALUE:
      node = buildElementaryTypeOutputValue(buildContext);
      break;
    case NodeKind.EXPANDABLE_MODIFIER:
      node = buildExpandableModifier(buildContext);
      break;
    case NodeKind.EXTENDS_MODIFIER:
      node = buildExtendsModifier(buildContext);
      break;
    case NodeKind.LENGTH_ATTRIBUTE:
      node = buildLengthAttribute(buildContext);
      break;
    case NodeKind.MAP_ENTRY:
      node = buildMapEntry(buildContext);
      break;
    case NodeKind.NUMBER_LITERAL:
      node = buildMultipleCharacterLiteral(buildContext);
      break;
    case NodeKind.PARAMETER:
      node = buildParameter(buildContext);
      break;
    case NodeKind.PARAMETER_LIST:
      node = buildParameterList(buildContext);
      break;
    case NodeKind.PARAMETER_VALUE_LIST:
      node = buildParameterValueList(buildContext);
      break;
    case NodeKind.SPECIFICATION:
      node = buildSpecification(buildContext);
      break;
    case NodeKind.UNEXPECTED_ERROR:
      node = buildUnexpectedError(buildContext);
      break;
    // These are node types that should be handled by other consumers
    case NodeKind.IDENTIFIER:
    case NodeKind.TOKEN:
      throw new InternalParseError(
        `consumeAstNode cannot consume node of kind: ${NodeKind[nodeKind]}`,
      );
    default: {
      const exhaustiveCheck: never = nodeKind;
      throw new InternalParseError(
        "Unreachable code reached, nodeKind == " + exhaustiveCheck,
      );
    }
  }

  if (!childStack.isEndOfSiblings) {
    // skip any whitespace or missing error nodes as these are inserted by parser when recovering
    consumeWhiteSpaceAndMissingErrors(buildContext);

    if (!childStack.isEndOfSiblings) {
      throw new InternalParseError(
        `Expected to have consumed all child nodes of ${
          NodeKind[nodeKind]
        }, but some remain.`,
      );
    }
  }

  buildContext.stateStack.pop();

  if (!cursor.parent()) {
    throw new InternalParseError(
      `Expected to move cursor back to parent of ${
        NodeKind[nodeKind]
      }, but failed.`,
    );
  }

  logger.debug(currentState.indent + "...consumed node: " + NodeKind[nodeKind]);

  return node;
}
