import { AstPath, type Doc, doc } from "prettier";
import { addCommaSeparatorsToDoc, getDocWithTrivia } from "./print_utils.ts";
import type { BitModifier } from "../ast/node/BitModifier.ts";
import type { AbstractNode } from "../ast/node/AbstractNode.ts";
import type { ClassDeclaration } from "../ast/node/ClassDeclaration.ts";
import type { ExtendedClassIdRange } from "../ast/node/ExtendedClassIdRange.ts";
import type { AbstractClassId } from "../ast/node/AbstractClassId.ts";
import type { ClassDefinition } from "../ast/node/ClassDefinition.ts";
import type { ClassIdRange } from "../ast/node/ClassIdRange.ts";
import { ClassIdKind } from "../ast/node/enum/class_id_kind.ts";
import type { ExpandableModifier } from "../ast/node/ExpandableModifier.ts";
import type { ExtendsModifier } from "../ast/node/ExtendsModifier.ts";
import type { Parameter } from "../ast/node/Parameter.ts";
import type { ParameterList } from "../ast/node/ParameterList.ts";
import type { ParameterValueList } from "../ast/node/ParameterValueList.ts";
import type { ClassId } from "../ast/node/ClassId.ts";
const { hardline, indent, join } = doc.builders;

export function printBitModifier(
  path: AstPath<BitModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const bitModifier = path.node;
  const elements = [];

  elements.push(getDocWithTrivia(bitModifier.colonPunctuator));

  const subElements = [];

  subElements.push(getDocWithTrivia(bitModifier.bitKeyword));
  subElements.push(
    getDocWithTrivia(bitModifier.openParenthesisPunctuator),
  );
  subElements.push(path.call(print, "length"));
  subElements.push(
    getDocWithTrivia(bitModifier.closeParenthesisPunctuator),
  );

  elements.push(subElements);

  if (bitModifier.identifier !== undefined) {
    elements.push(
      path.call(
        print,
        "identifier" as keyof BitModifier["identifier"],
      ),
    );
  }

  if (bitModifier.assignmentOperator !== undefined) {
    elements.push(getDocWithTrivia(bitModifier.assignmentOperator!));
  }

  elements.push(
    path.call(
      print,
      "classId",
    ),
  );

  return join(" ", elements);
}

export function printClassDeclaration(
  path: AstPath<ClassDeclaration>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDeclaration = path.node;

  const elements = [];

  if (classDeclaration.alignedModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "alignedModifier" as keyof ClassDeclaration["alignedModifier"],
      ),
    );
  }

  if (classDeclaration.expandableModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "expandableModifier" as keyof ClassDeclaration["expandableModifier"],
      ),
    );
  }

  if (classDeclaration.isAbstract) {
    elements.push(getDocWithTrivia(classDeclaration.abstractKeyword!));
  }

  elements.push(getDocWithTrivia(classDeclaration.classKeyword));

  const identifierElements = [
    path.call(print, "identifier"),
  ];

  if (classDeclaration.parameterList !== undefined) {
    identifierElements.push(
      path.call(
        print,
        "parameterList" as keyof ClassDeclaration["parameterList"],
      ),
    );
  }

  elements.push(identifierElements);

  if (classDeclaration.extendsModifier !== undefined) {
    elements.push(
      path.call(
        print,
        "extendsModifier" as keyof ClassDeclaration["extendsModifier"],
      ),
    );
  }

  if (classDeclaration.bitModifier !== undefined) {
    elements.push(
      path.call(print, "bitModifier" as keyof ClassDeclaration["bitModifier"]),
    );
  }

  elements.push(getDocWithTrivia(classDeclaration.openBracePunctuator));

  const parts = [];

  parts.push(join(" ", elements));

  if (classDeclaration.statements.length > 0) {
    parts.push(indent([
      hardline,
      join(hardline, path.map(print, "statements")),
    ]));
  }
  parts.push(
    getDocWithTrivia(classDeclaration.closeBracePunctuator, true),
  );

  return parts;
}

export function printClassDefinition(
  path: AstPath<ClassDefinition>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const classDefinition = path.node;

  const elements = [];

  if (classDefinition.isLegacy) {
    elements.push(getDocWithTrivia(classDefinition.legacyKeyword!));
  }

  elements.push(path.call(print, "classIdentifier"));

  const identifierElements = [
    path.call(print, "identifier"),
  ];

  if (classDefinition.parameterValueList !== undefined) {
    identifierElements.push([
      path.call(
        print,
        "parameterValueList" as keyof ClassDefinition["parameterValueList"],
      ),
    ]);
  }

  elements.push(identifierElements);

  return [
    join(" ", elements),
    getDocWithTrivia(classDefinition.semicolonPunctuator),
  ];
}

export function printClassId(
  path: AstPath<AbstractClassId>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const { classIdKind } = path.node;
  switch (classIdKind) {
    case ClassIdKind.SINGLE:
      return (path as AstPath<ClassId>).call(print, "value");
    case ClassIdKind.RANGE: {
      const classIdRange = path.node as ClassIdRange;
      return [
        (path as AstPath<ClassIdRange>).call(print, "startClassId"),
        getDocWithTrivia(classIdRange.rangeOperator),
        (path as AstPath<ClassIdRange>).call(print, "endClassId"),
      ];
    }
    case ClassIdKind.EXTENDED_RANGE: {
      const extendedClassIdRange = path.node as ExtendedClassIdRange;
      const elements = [];
      const outputValuesDoc = (path as AstPath<ExtendedClassIdRange>).map(
        print,
        "classIds",
      );

      elements.push(
        ...addCommaSeparatorsToDoc(
          outputValuesDoc,
          extendedClassIdRange.commaPunctuators,
        ),
      );

      return elements;
    }
    default: {
      const exhaustiveCheck: never = classIdKind;
      throw new Error(
        "Unreachable code reached, classIdKind == " + exhaustiveCheck,
      );
    }
  }
}

export function printExpandableModifier(
  path: AstPath<ExpandableModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const expandableModifier = path.node;

  const elements = [];

  elements.push(getDocWithTrivia(expandableModifier.expandableKeyword));

  if (expandableModifier.maxClassSize !== undefined) {
    elements.push(
      getDocWithTrivia(expandableModifier.openParenthesisPunctuator!),
    );
    elements.push(
      path.call(
        print,
        "maxClassSize" as keyof ExpandableModifier["maxClassSize"],
      ),
    ),
      elements.push(
        getDocWithTrivia(expandableModifier.closeParenthesisPunctuator!),
      );
  }

  return elements;
}

export function printExtendsModifier(
  path: AstPath<ExtendsModifier>,
  print: (path: AstPath<AbstractNode>) => Doc,
): Doc {
  const mapEntryList = path.node;
  const elements = [
    path.call(print, "identifier"),
  ];

  if (mapEntryList.parameterValueList !== undefined) {
    elements.push(
      path.call(
        print,
        "parameterValueList" as keyof ExtendsModifier["parameterValueList"],
      ),
    );
  }

  return join(" ", [
    getDocWithTrivia(mapEntryList.extendsKeyword),
    elements,
  ]);
}

export function printParameter(
  path: AstPath<Parameter>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameter = path.node;
  const elements = [];

  if (parameter.classIdentifier !== undefined) {
    elements.push(
      path.call(
        print,
        "classIdentifier" as keyof Parameter["classIdentifier"],
      ),
    );
  } else if (parameter.elementaryType !== undefined) {
    elements.push(
      path.call(
        print,
        "elementaryType" as keyof Parameter["elementaryType"],
      ),
    );
  }

  elements.push(path.call(print, "identifier"));

  return join(" ", elements);
}

export function printParameterList(
  path: AstPath<ParameterList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterList = path.node;

  const outputValuesDoc = path.map(print, "parameters");

  const elements = addCommaSeparatorsToDoc(
    outputValuesDoc,
    parameterList.commaPunctuators,
  );

  return [
    getDocWithTrivia(parameterList.openParenthesisPunctuator),
    join(" ", elements),
    getDocWithTrivia(parameterList.closeParenthesisPunctuator),
  ];
}

export function printParameterValueList(
  path: AstPath<ParameterValueList>,
  print: (path: AstPath<AbstractNode>) => Doc,
): doc.builders.Doc {
  const parameterValueList = path.node;

  const outputValuesDoc = path.map(print, "values");

  const elements = addCommaSeparatorsToDoc(
    outputValuesDoc,
    parameterValueList.commaPunctuators,
  );

  return [
    getDocWithTrivia(parameterValueList.openParenthesisPunctuator),
    join(" ", elements),
    getDocWithTrivia(parameterValueList.closeParenthesisPunctuator),
  ];
}
