import { Text } from "@codemirror/state";
import type { TreeCursor } from "@lezer/common";
import { InternalParseError } from "../../ParseError.ts";
import { getChildNodesAndTokens } from "../../util/nodeFactoryUtils.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { Token } from "../token/Token.ts";
import { ClassDefinition } from "../node/ClassDefinition.ts";
import type { ParameterValueList } from "../node/ParameterValueList.ts";
import { isAbstractNode } from "../../util/nodeUtils.ts";

export function getClassDefinition(
  cursor: TreeCursor,
  text: Text,
): ClassDefinition {
  let legacyKeyword: Token | undefined;
  let classIdentifier: Identifier | undefined;
  let identifier: Identifier | undefined;
  let parameterValueList: ParameterValueList | undefined;
  let semicolonPunctuator: Token | undefined;

  const childNodesAndTokens = getChildNodesAndTokens(cursor, text);
  for (const childNodeOrToken of childNodesAndTokens) {
    if (isAbstractNode(childNodeOrToken)) {
      switch (childNodeOrToken.nodeKind) {
        case NodeKind.IDENTIFIER:
          if (classIdentifier) {
            identifier = childNodeOrToken as Identifier;
          } else {
            classIdentifier = childNodeOrToken as Identifier;
          }
          break;
        case NodeKind.PARAMETER_VALUE_LIST:
          parameterValueList = childNodeOrToken as ParameterValueList;
          break;
        default:
          throw new InternalParseError(
            `Unexpected node kind: ${NodeKind[childNodeOrToken.nodeKind]}`,
          );
      }
    } else {
      switch (childNodeOrToken.text) {
        case "legacy":
          legacyKeyword = childNodeOrToken;
          break;
        case ";":
          semicolonPunctuator = childNodeOrToken;
          break;
        default:
          throw new InternalParseError(
            `Unexpected token: ${childNodeOrToken.text}`,
          );
      }
    }
  }

  if (identifier === undefined) {
    throw new InternalParseError("Expected argument identifier to be defined");
  }
  if (semicolonPunctuator === undefined) {
    throw new InternalParseError(
      "Expected argument semicolonPunctuator to be defined",
    );
  }
  if (classIdentifier === undefined) {
    throw new InternalParseError(
      "Expected argument classIdentifier to be defined",
    );
  }
  return new ClassDefinition(
    legacyKeyword !== undefined,
    classIdentifier,
    identifier,
    parameterValueList,
    legacyKeyword,
    semicolonPunctuator,
  );
}
