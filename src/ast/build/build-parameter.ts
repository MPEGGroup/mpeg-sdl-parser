import { InternalParseError } from "../../parse-error.ts";
import { ElementaryType } from "../node/elementary-type.ts";
import { NodeKind } from "../node/enum/node-kind.ts";
import { Parameter } from "../node/parameter.ts";
import type { Identifier } from "../node/identifier.ts";
import type { BuildContext } from "./build-context.ts";
import type { AbstractNode } from "../node/abstract-node.ts";
import { fetchOptionalNode, fetchRequiredNode } from "../util/fetch-node.ts";
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
