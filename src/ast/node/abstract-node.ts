import { NodeKind } from "./enum/node-kind.ts";
import type { Trivia } from "./trivia.ts";

export abstract class AbstractNode {
  public leadingTrivia: Trivia[] | undefined;
  public trailingTrivia: Trivia[] | undefined;

  constructor(
    public readonly nodeKind: NodeKind,
    public readonly isComposite: boolean,
  ) {
  }
}
