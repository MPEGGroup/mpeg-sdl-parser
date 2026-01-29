import type { ClassDeclaration } from "../ast/node/class-declaration.ts";
import type { ElementaryType } from "../ast/node/elementary-type.ts";
import type { MapDeclaration } from "../ast/node/map-declaration.ts";
import type { SymbolKind } from "./enum/symbol-kind.ts";
import type { Location } from "../location.ts";

export interface SymbolAttributes {
  // TODO: Why not enum?
  elementaryType?: ElementaryType;
  // TODO: Why not reference to ClassDeclaration?
  // TODO: Need to account for scope here?
  classReference?: string;
  isArray?: boolean;
  // TODO: isString?
  isComputed?: boolean;
  isConst?: boolean;
}

export interface Symbol {
  name: string;
  kind: SymbolKind;
  attributes: SymbolAttributes;
  location: Location;
  // TODO: why is this used?
  declarationNode?: ClassDeclaration | MapDeclaration;
}
