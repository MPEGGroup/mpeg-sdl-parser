import { describe, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";

describe("Print Switch tests", () => {
  test("prettified switch output is as expected", async () => {
    await testPrettierScenario(
      "class A{switch (long_variable_name) { case 1: something = something + another_thing; break; case 2: do_something_else++; break; default: do_default++; }}",
      "class A {\n" +
        "  switch (long_variable_name) {\n" +
        "    case 1:\n" +
        "      something = something + another_thing;\n" +
        "      break;\n" +
        "    case 2:\n" +
        "      do_something_else++;\n" +
        "      break;\n" +
        "    default:\n" +
        "      do_default++;\n" +
        "  }\n" +
        "}\n",
      "class A {\n" +
        "  switch (long_variable_name) {\n" +
        "    case 1:\n" +
        "      something = something +\n" +
        "        another_thing;\n" +
        "      break;\n" +
        "    case 2:\n" +
        "      do_something_else++;\n" +
        "      break;\n" +
        "    default:\n" +
        "      do_default++;\n" +
        "  }\n" +
        "}\n",
    );
  });

  test("prettified switch with trivia output is as expected", async () => {
    await testPrettierScenario(
      "class A { switch (i) {\n    case 0:\n   case 1:\n\n            // nothing\n      break;\n   case 2: \n\n            { // nothing\n      break;\n      }\n    default:\n      i++;\n      //     foo\n  }}\n",
      "class A {\n" +
        "  switch (i) {\n" +
        "    case 0:\n" +
        "    case 1:\n" +
        "      // nothing\n" +
        "      break;\n" +
        "    case 2: { // nothing\n" +
        "      break;\n" +
        "    }\n" +
        "    default:\n" +
        "      i++;\n" +
        "    // foo\n" +
        "  }\n" +
        "}\n",
      "class A {\n" +
        "  switch (i) {\n" +
        "    case 0:\n" +
        "    case 1:\n" +
        "      // nothing\n" +
        "      break;\n" +
        "    case 2: { // nothing\n" +
        "      break;\n" +
        "    }\n" +
        "    default:\n" +
        "      i++;\n" +
        "    // foo\n" +
        "  }\n" +
        "}\n",
    );
  });
});
