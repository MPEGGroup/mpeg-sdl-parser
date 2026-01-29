import type { SymbolKind } from "./enum/symbol-kind.ts";
import type { Location } from "../location.ts";
import type { ElementaryTypeKind } from "../ast/node/enum/elementary-type-kind.ts";
import type { AbstractCompositeNode } from "../ast/node/abstract-composite-node.ts";
import type { StringVariableKind } from "../ast/node/enum/string-variable-kind.ts";

export interface SymbolAttributes {
  isComputed?: boolean;
  isConst?: boolean;
  isString?: boolean;
  isArray?: boolean;

  elementaryTypeKind?: ElementaryTypeKind;
  stringVariableKind?: StringVariableKind;

  // For array of class types, Map class output type or Class definition
  classReference?: string;
  // For Map definition
  mapReference?: string;
}

export interface Symbol {
  name: string;
  kind: SymbolKind;
  attributes: SymbolAttributes;
  location: Location;
  node: AbstractCompositeNode;
}
