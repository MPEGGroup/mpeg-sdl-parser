import type { BuildContext } from "../util/build-context.ts";
import { UnexpectedError } from "../../node/unexpected-error.ts";
import { fetchRequiredNode } from "../util/fetch-node.ts";
import type { AbstractNode } from "../../node/abstract-node.ts";

export function buildUnexpectedError(
  buildContext: BuildContext,
): UnexpectedError {
  const unexpectedNode = fetchRequiredNode<AbstractNode>(
    buildContext,
  );

  return new UnexpectedError(unexpectedNode);
}
