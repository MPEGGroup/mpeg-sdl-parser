import { describe, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";

describe("Print String tests", () => {
  test("prettified UTF8 string output is as expected", async () => {
    await testPrettierScenario(
      'class A{reserved // odd comment location \nconst utf8string foo_with_an_extra_long_name = u"big_long_bar" u"foo_which_is_even_longer" u"u";}',
      "class A {\n" +
        "  reserved // odd comment location\n" +
        '    const utf8string foo_with_an_extra_long_name = u"big_long_bar" u"foo_which_is_even_longer" u"u";\n' +
        "}\n",
      "class A {\n" +
        "  reserved // odd comment location\n" +
        "    const utf8string foo_with_an_extra_long_name =\n" +
        '    u"big_long_bar"\n' +
        '    u"foo_which_is_even_longer" u"u";\n' +
        "}\n",
    );
  });

  test("prettified Base64 string output is as expected", async () => {
    await testPrettierScenario(
      'class A{reserved // odd comment location \nconst base64string foo_with_an_extra_long_name = "ABCDABCD" "ABCDABCDABCDABCDABCDABCD";}',
      "class A {\n" +
        "  reserved // odd comment location\n" +
        '    const base64string foo_with_an_extra_long_name = "ABCDABCD" "ABCDABCDABCDABCDABCDABCD";\n' +
        "}\n",
      "class A {\n" +
        "  reserved // odd comment location\n" +
        "    const base64string foo_with_an_extra_long_name =\n" +
        '    "ABCDABCD"\n' +
        '    "ABCDABCDABCDABCDABCDABCD";\n' +
        "}\n",
    );
  });
});
