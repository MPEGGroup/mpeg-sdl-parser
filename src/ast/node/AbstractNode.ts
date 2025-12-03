import { NodeKind } from "./enum/node_kind.ts";
import type { Trivia } from "./Trivia.ts";

export abstract class AbstractNode {
  public leadingTrivia: Trivia[] | undefined;
  public trailingTrivia: Trivia[] | undefined;

  constructor(
    public readonly nodeKind: NodeKind,
    public readonly isComposite: boolean,
  ) {
  }
}
