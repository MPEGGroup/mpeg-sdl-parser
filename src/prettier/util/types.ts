import { type Doc, doc } from "prettier";

type Fill = doc.builders.Fill;
type Label = doc.builders.Label;
type Indent = doc.builders.Indent;
type Hardline = doc.builders.Hardline;
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

export function isLabel(
  doc: Doc,
): doc is Label {
  return (doc as Label).type === "label";
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
    ((doc as Hardline)[0].type === "line") &&
    ((doc as Hardline)[0].hard === true) &&
    ((doc as Hardline)[1].type === "break-parent");
}
