import { InternalParseError } from "../../ParseError.ts";
import { ElementaryType } from "../node/ElementaryType.ts";
import { NodeKind } from "../node/enum/node_kind.ts";
import { Parameter } from "../node/Parameter.ts";
import type { Identifier } from "../node/Identifier.ts";
import type { BuildContext } from "./BuildContext.ts";
import type { AbstractNode } from "../node/AbstractNode.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetchNode.ts";
import type { OptionalNode } from "../util/types.ts";

export function buildParameter(
  buildContext: BuildContext,
): Parameter {
  const children: Array<AbstractNode> = [];

  const classIdentifier = fetchOptionalNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  let elementaryType: OptionalNode<ElementaryType> = undefined;
  if (classIdentifier) {
    children.push(classIdentifier);
  } else {
    elementaryType = fetchOptionalNode<ElementaryType>(
      buildContext,
      NodeKind.ELEMENTARY_TYPE,
    );
    if (elementaryType) {
      children.push(elementaryType);
    } else {
      throw new InternalParseError(
        "Parameter must have either a class identifier or an elementary type.",
      );
    }
  }
  const identifier = fetchRequiredNode<Identifier>(
    buildContext,
    NodeKind.IDENTIFIER,
  );
  children.push(identifier);
  return new Parameter(
    classIdentifier,
    elementaryType,
    identifier,
    children,
  );
}
