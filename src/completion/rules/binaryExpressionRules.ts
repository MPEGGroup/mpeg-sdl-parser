import { binaryOperatorTypes, expressionTypes } from "./abstractTypes.ts";

export const binaryExpressionRules = [
  {
    previous: -1,
    expected: expressionTypes,
  },
  ...expressionTypes.map((type) => {
    return {
      previous: type,
      expected: binaryOperatorTypes,
    };
  }),
  ...binaryOperatorTypes.map((type) => {
    return {
      previous: type,
      expected: expressionTypes,
    };
  }),
];
