import { describe, test } from "bun:test";
import { testPrettierScenario } from "./testPrettierScenario.ts";

describe("Print String tests", () => {
  test("prettified string output is as expected", async () => {
    await testPrettierScenario(
      'class A{reserved // odd comment location \nconst utf8string foo_with_an_extra_long_name = u"big_long_bar" u"foo_which_is_even_longer";}',
      "class A {\n" +
        "  reserved // odd comment location\n" +
        '    const utf8string foo_with_an_extra_long_name = u"big_long_bar" u"foo_which_is_even_longer";\n' +
        "}\n",
      "class A {\n" +
        "  reserved // odd comment location\n" +
        "    const utf8string foo_with_an_extra_long_name =\n" +
        '    u"big_long_bar"\n' +
        '    u"foo_which_is_even_longer";\n' +
        "}\n",
    );
  });
});
