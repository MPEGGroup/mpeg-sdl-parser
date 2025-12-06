import { type Doc, doc } from "prettier";

type Fill = doc.builders.Fill;
type Indent = doc.builders.Indent;
type Hardline = doc.builders.Hardline;
type HardlineWithoutBreakParent = doc.builders.HardlineWithoutBreakParent;
type BreakParent = doc.builders.BreakParent;

export function isIndent(
  doc: Doc,
): doc is Indent {
  return (doc as Indent).type === "indent";
}

export function isFill(
  doc: Doc,
): doc is Fill {
  return (doc as Fill).type === "fill";
}

export function isBreakParent(
  doc: Doc,
): doc is BreakParent {
  return (doc as BreakParent).type === "break-parent";
}

export function isHardline(
  doc: Doc,
): doc is Hardline {
  return Array.isArray(doc) && (doc.length === 2) &&
    ((doc[0] as HardlineWithoutBreakParent).type === "line") &&
    (doc[0] as HardlineWithoutBreakParent).hard === true;
}
