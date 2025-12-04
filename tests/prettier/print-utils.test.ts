import type { Doc } from "prettier";
import { doc } from "prettier";
import { describe, expect, test } from "bun:test";
import { testPrettierScenario } from "./test-prettier-scenario.ts";
import {
  endsWithHardline,
  removeTrailingHardline,
} from "../../src/prettier/print-utils.ts";

const { breakParent, hardline, line, indent, fill } = doc.builders;

describe("Print Utils tests", () => {
  test("endsWithHardline works as expected", () => {
    expect(endsWithHardline("x")).toBe(false);
    expect(endsWithHardline(hardline)).toBe(true);
    expect(endsWithHardline(["x"])).toBe(false);
    expect(endsWithHardline([hardline])).toBe(true);
    expect(endsWithHardline([hardline, "x"])).toBe(false);
    expect(endsWithHardline(["x", hardline])).toBe(true);
    expect(endsWithHardline(indent("x"))).toBe(false);
    expect(endsWithHardline(indent(hardline))).toBe(true);
    expect(endsWithHardline(indent(["x"]))).toBe(false);
    expect(endsWithHardline(indent([hardline]))).toBe(true);
    expect(endsWithHardline(indent([hardline, "x"]))).toBe(false);
    expect(endsWithHardline(indent(["x", hardline]))).toBe(true);
    expect(endsWithHardline(indent(indent([[hardline, ["x"]]])))).toBe(false);
    expect(endsWithHardline(indent(indent([["x", [hardline]]])))).toBe(true);
    expect(endsWithHardline(fill(hardline))).toBe(true);
    expect(endsWithHardline(fill(["x"]))).toBe(false);
    expect(endsWithHardline(fill([hardline]))).toBe(true);
    expect(endsWithHardline(fill([hardline, "x"]))).toBe(false);
    expect(endsWithHardline(fill(["x", hardline]))).toBe(true);
    expect(endsWithHardline(fill(["x", indent([[hardline, ["x"]]])]))).toBe(
      false,
    );
    expect(endsWithHardline(fill([indent([["x", [hardline]]])]))).toBe(true);
    expect(
      endsWithHardline(
        fill([[["i"], ["++"]], [
          ";",
          line,
          "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
          [hardline, breakParent],
        ]]),
      ),
    ).toBe(true);
  });

  test("removeTrailingHardline works as expected", () => {
    let doc: Doc = "x";
    removeTrailingHardline(doc);
    expect(doc).toEqual("x");

    // no effect on single hardline as no array to remove it from
    doc = hardline;
    removeTrailingHardline(doc);
    expect(doc).toEqual(hardline);

    doc = ["x"];
    removeTrailingHardline(doc);
    expect(doc).toEqual(["x"]);

    doc = ["x", hardline];
    removeTrailingHardline(doc);
    expect(doc).toEqual(["x"]);

    doc = [hardline, "x"];
    removeTrailingHardline(doc);
    expect(doc).toEqual([hardline, "x"]);

    doc = [[["x", [hardline]]]];
    removeTrailingHardline(doc);
    expect(doc).toEqual([[["x", []]]]);

    doc = [indent([["x", [hardline]]])];
    removeTrailingHardline(doc);
    expect(doc).toEqual([indent([["x", []]])]);

    // no effect on single hardline as no array to remove it from
    doc = indent(hardline);
    removeTrailingHardline(doc);
    expect(doc).toEqual(indent(hardline));

    doc = indent(["x", hardline]);
    removeTrailingHardline(doc);
    expect(doc).toEqual(indent(["x"]));

    // no effect on single hardline as no array to remove it from
    doc = fill(hardline);
    removeTrailingHardline(doc);
    expect(doc).toEqual(fill(hardline));

    doc = fill(["x", hardline]);
    removeTrailingHardline(doc);
    expect(doc).toEqual(fill(["x"]));

    doc = fill([indent([["x", [hardline]]])]);
    removeTrailingHardline(doc);
    expect(doc).toEqual(fill([indent([["x", []]])]));

    doc = fill([[["i"], ["++"]], [
      ";",
      line,
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
      [hardline, breakParent],
    ]]);
    removeTrailingHardline(doc);
    expect(doc).toEqual(fill([[["i"], ["++"]], [
      ";",
      line,
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
      [breakParent],
    ]]));
  });

  test("no trivia comment", async () => {
    await testPrettierScenario(
      "class A{} ",
      "class A {\n" +
        "}\n",
      "class A {\n" +
        "}\n",
    );
  });

  test("trivia comment on own line", async () => {
    await testPrettierScenario(
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\nclass A{} ",
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "class A {\n" +
        "}\n",
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "class A {\n" +
        "}\n",
    );
  });

  test("trivia comment on own indented line", async () => {
    await testPrettierScenario(
      "class A{\n  // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n }",
      "class A {\n" +
        "  // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "}\n",
      "class A {\n" +
        "  // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "}\n",
    );
  });

  test("trivia comment following syntactic elements", async () => {
    await testPrettierScenario(
      "class A{\n  i++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n }",
      "class A {\n" +
        "  i++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "}\n",
      "class A {\n" +
        "  i++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "}\n",
    );
  });

  test("trivia comment in between syntactic elements", async () => {
    await testPrettierScenario(
      "class A{\n  i++ // odd but valid comment position\n; \n}",
      "class A {\n" +
        "  i++ // odd but valid comment position\n" +
        "  ;\n" +
        "}\n",
      "class A {\n" +
        "  i++ // odd but valid comment position\n" +
        "  ;\n" +
        "}\n",
    );
  });

  test("trivia comment in between syntactic elements which are line wrapped", async () => {
    await testPrettierScenario(
      "class A{\n computed unsigned int adaptation_field_control // odd but valid comment position\n; \n}",
      "class A {\n" +
        "  computed unsigned int adaptation_field_control // odd but valid comment position\n" +
        "  ;\n" +
        "}\n",
      "class A {\n" +
        "  computed unsigned int\n" +
        "    adaptation_field_control\n" +
        "    // odd but valid comment position\n" +
        "  ;\n" +
        "}\n",
    );
  });

  test("trivia comment trailing, leading and in between syntactic elements", async () => {
    await testPrettierScenario(
      "class A{\n // leading comment \n i++ // odd but valid comment position\n; // trailing comment \n // leading comment\n} // trailing comment",
      "class A {\n" +
        "  // leading comment\n" +
        "  i++ // odd but valid comment position\n" +
        "  ; // trailing comment\n" +
        "  // leading comment\n" +
        "} // trailing comment\n",
      "class A {\n" +
        "  // leading comment\n" +
        "  i++ // odd but valid comment position\n" +
        "  ; // trailing comment\n" +
        "  // leading comment\n" +
        "} // trailing comment\n",
    );
  });

  test("trivia comments with intentional blank lines", async () => {
    await testPrettierScenario(
      "class A{\n\n j++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n\n\n // Another comment line with a blank line above\n\n\n // Another comment line with a blank line above\n i++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n\n\n// Another comment line with a blank line\n\n}",
      "class A {\n" +
        // remove blank lines after opening brace
        "  j++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        // multiple blank lines after statement reduced to single blank line
        "\n" +
        "  // Another comment line with a blank line above\n" +
        // multiple blank lines between comments and another comment reduced to single blank line
        "\n" +
        "  // Another comment line with a blank line above\n" +
        "  i++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        // multiple blank lines after statement reduced to single blank line
        "\n" +
        "  // Another comment line with a blank line\n" +
        // remove blank lines before closing brace
        "}\n",
      "class A {\n" +
        "  j++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "\n" +
        "  // Another comment line with a blank line above\n" +
        "\n" +
        "  // Another comment line with a blank line above\n" +
        "  i++; // Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée\n" +
        "\n" +
        "  // Another comment line with a blank line\n" +
        "}\n",
    );
  });
});
