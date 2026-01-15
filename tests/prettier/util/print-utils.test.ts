import type { Doc } from "prettier";
import { doc } from "prettier";
import { describe, expect, test } from "bun:test";
import { testPrettierScenario } from "../test-prettier-scenario.ts";
import {
  addIndentedStatements,
  addTrailingHardline,
  addTrailingTriviaDoc,
  endsWithHardline,
  removeLeadingBlanklines,
  removeTrailingBlankline,
  removeTrailingHardline,
  startsWithBlankLine,
} from "../../../src/prettier/util/print-utils.ts";

const { breakParent, hardline, ifBreak, label, line, indent, fill } =
  doc.builders;

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

    // skipped break-parents
    expect(endsWithHardline([hardline, breakParent])).toBe(true);
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

    // ensure false positive doesn't occur
    expect(endsWithHardline({ type: "line", hard: true })).toBe(false);
    expect(endsWithHardline([{ type: "line", hard: true }])).toBe(false);
  });

  test("startsWithBlankLine works as expected", () => {
    let doc: Doc = "x";
    expect(startsWithBlankLine(doc)).toBe(false);

    doc = ["", hardline, "x"];
    expect(startsWithBlankLine(doc)).toBe(true);

    doc = ["", hardline];
    expect(startsWithBlankLine(doc)).toBe(true);

    doc = [["", hardline], "x"];
    expect(startsWithBlankLine(doc)).toBe(true);

    doc = ["x", "", hardline];
    expect(startsWithBlankLine(doc)).toBe(false);

    doc = ["", "x", hardline];
    expect(startsWithBlankLine(doc)).toBe(false);

    doc = [hardline, "x"];
    expect(startsWithBlankLine(doc)).toBe(false);

    doc = ["", "x"];
    expect(startsWithBlankLine(doc)).toBe(false);
  });

  test("removeLeadingBlanklines works as expected", () => {
    let doc: Doc = "x";
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual("x");

    doc = ["", hardline, "x"];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual("x");

    doc = ["", hardline];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual([]);

    doc = [["", hardline], "x"];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual("x");

    doc = ["x", "", hardline];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual(["x", "", hardline]);

    doc = ["", "x", hardline];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual(["", "x", hardline]);

    doc = [hardline, "x"];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual([hardline, "x"]);

    doc = ["", "x"];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual(["", "x"]);

    doc = ["", hardline, "", hardline, "x"];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual("x");

    doc = ["", hardline, "", hardline];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual([]);

    doc = [["", hardline], ["", hardline], "x"];
    doc = removeLeadingBlanklines(doc);
    expect(doc).toEqual("x");
  });

  test("removeTrailingBlankline works as expected", () => {
    let doc: Doc = "x";
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual("x");

    doc = ["x", "", hardline];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual("x");

    doc = ["", hardline];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual([]);

    doc = ["x", ["", hardline]];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual("x");

    doc = ["", hardline, "x"];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual(["", hardline, "x"]);

    doc = [hardline, "x", ""];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual([hardline, "x", ""]);

    doc = ["x", hardline];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual(["x", hardline]);

    doc = ["x", ""];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual(["x", ""]);

    doc = [fill([hardline, "}"]), hardline];
    doc = removeTrailingBlankline(doc);
    expect(doc).toEqual([fill([hardline, "}"]), hardline]);
  });

  test("removeTrailingHardline works as expected", () => {
    let doc: Doc = "x";
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("x");

    doc = hardline;
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("");

    doc = ["x"];
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("x");

    doc = ["x", hardline];
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("x");

    doc = [hardline, "x"];
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual([hardline, "x"]);

    doc = [[["x", [hardline]]]];
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("x");

    doc = [indent([["x", [hardline]]])];
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual(indent("x"));

    // no effect on single hardline as no array to remove it from
    doc = indent(hardline);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("");

    doc = indent(["x", hardline]);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual(indent("x"));

    // no effect on single hardline as no array to remove it from
    doc = fill(hardline);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual("");

    doc = fill(["x", hardline]);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual(fill(["x"]));

    doc = fill([indent([["x", [hardline]]])]);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual(fill([indent("x")]));

    doc = fill([[["i"], ["++"]], [
      ";",
      line,
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
      [hardline],
    ]]);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual(fill([[["i"], ["++"]], [
      ";",
      line,
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
    ]]));

    doc = fill([[["i"], ["++"]], [
      ";",
      line,
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
      [hardline, breakParent],
    ]]);
    doc = removeTrailingHardline(doc);
    expect(doc).toEqual(fill([[["i"], ["++"]], [
      ";",
      line,
      "// Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée",
      [hardline, breakParent],
    ]]));
  });

  test("addIndentedStatements works as expected", () => {
    let doc: Doc[] = [];
    doc = addIndentedStatements(doc, []);
    expect(doc).toEqual([]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [],
      "{",
      "}",
    );
    expect(doc).toEqual([
      indent("{"),
      hardline,
      "}",
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [
        ["i", ";"],
        ["j", ";"],
      ],
    );
    expect(doc).toEqual([
      indent([
        hardline,
        ["i", ";"],
        hardline,
        ["j", ";"],
      ]),
      hardline,
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [
        ["i", ";"],
        ["j", ";"],
      ],
      "{",
      "}",
    );
    expect(doc).toEqual([
      indent([
        "{",
        hardline,
        ["i", ";"],
        hardline,
        ["j", ";"],
      ]),
      hardline,
      "}",
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [
        ["foo"],
        ["bar"],
      ],
    );
    expect(doc).toEqual([
      indent([
        hardline,
        ["foo"],
        hardline,
        "bar",
      ]),
      hardline,
    ]);
  });

  test("addIndentedStatements with blank lines works as expected", () => {
    let doc: Doc[] = [];
    doc = addIndentedStatements(
      doc,
      [],
      ["", hardline, "{"],
      "}",
    );
    expect(doc).toEqual([
      indent("{"),
      hardline,
      "}",
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [],
      "{",
      [
        label("leadingTrivia", ["", hardline]),
        "}",
      ],
    );
    expect(doc).toEqual([
      indent(
        "{",
      ),
      hardline,
      "}",
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [
        ["", hardline, "i", ";"],
        ["j", ";"],
      ],
    );
    expect(doc).toEqual([
      indent([
        hardline,
        ["i", ";"],
        hardline,
        ["j", ";"],
      ]),
      hardline,
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [
        ["i", ";"],
        ["j", ";", "", hardline],
      ],
    );
    expect(doc).toEqual([
      indent([
        hardline,
        ["i", ";"],
        hardline,
        ["j", ";"],
      ]),
      hardline,
    ]);
  });

  test("addIndentedStatements with trivia works as expected", () => {
    let doc: Doc[] = [];
    doc = addIndentedStatements(
      doc,
      [],
      [
        label("leadingTrivia", ["", hardline, "// foo"]),
        "{",
        label("trailingTrivia", ["", hardline, "// bar"]),
      ],
      "}",
    );
    expect(doc).toEqual([
      indent([
        label("leadingTrivia", "// foo"),
        "{",
        label("trailingTrivia", ["", hardline, "// bar"]),
      ]),
      hardline,
      "}",
    ]);

    doc = [];
    doc = addIndentedStatements(
      doc,
      [],
      "{",
      [
        label("leadingTrivia", ["", hardline, "// foo", "", hardline]),
        "}",
        label("trailingTrivia", ["", hardline, "// bar"]),
      ],
    );
    expect(doc).toEqual([
      indent([
        "{",
        hardline,
        label("leadingTrivia", ["", hardline, "// foo"]),
      ]),
      hardline,
      ["}", label("trailingTrivia", ["", hardline, "// bar"])],
    ]);
  });

  test("addTrailingHardline works as expected", () => {
    let docs: Doc = ["class", "A"];

    docs = addTrailingHardline(docs);
    expect(docs).toEqual(["class", "A", hardline]);

    docs = ["class", "A", hardline];
    docs = addTrailingHardline(docs);
    expect(docs).toEqual(["class", "A", hardline]);

    docs = ["class", "A", ["{", [hardline]]];
    docs = addTrailingHardline(docs);
    expect(docs).toEqual(["class", "A", ["{", [hardline]]]);

    docs = ["class", "A", ["{", [hardline, "{"]]];
    docs = addTrailingHardline(docs);
    expect(docs).toEqual(["class", "A", ["{", [hardline, "{"]], hardline]);
  });

  test("addTrailingTriviaDoc works as expected", () => {
    let docs: Doc = ["class", "A", "{"];
    const trailingTriviaDoc: Doc = ["// hello", hardline];

    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual(["class", "A", [
      "{",
      ifBreak([line, "  "], " "),
      ["// hello", hardline],
    ]]);

    docs = ["class", "A", "}"];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual(["class", "A", [
      "}",
      ifBreak([line, ""], " "),
      ["// hello", hardline],
    ]]);

    docs = ["class", "A", ["{"]];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual(["class", "A", [
      ["{", ifBreak([line, "  "], " "), ["// hello", hardline]],
    ]]);

    docs = [["class", "A", ["{"]]];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual([["class", "A", [[
      "{",
      ifBreak([line, "  "], " "),
      ["// hello", hardline],
    ]]]]);

    docs = [["class", "A", ["{"], hardline], hardline];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual([["class", "A", [[
      "{",
      ifBreak([line, "  "], " "),
      ["// hello", hardline],
    ]], hardline], hardline]);

    docs = [["class", "A", ["}"], hardline], hardline];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual([["class", "A", [[
      "}",
      ifBreak([line, ""], " "),
      ["// hello", hardline],
    ]], hardline], hardline]);

    docs = [["class", "A", ["}"], hardline], hardline];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual([["class", "A", [[
      "}",
      ifBreak([line, ""], " "),
      ["// hello", hardline],
    ]], hardline], hardline]);

    docs = [[]];
    docs = addTrailingTriviaDoc(docs, trailingTriviaDoc);
    expect(docs).toEqual([[
      ["// hello", hardline],
    ]]);
  });

  test("no trivia comment", async () => {
    await testPrettierScenario(
      "class A{}",
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
      "class A{\n // leading comment \n i++ // odd but valid comment position\n; // trailing comment \n // leading comment\n} // trailing comment\n\n",
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

  test("intentional blank lines", async () => {
    await testPrettierScenario(
      "class A{\n\n computed int a;\n\n}",
      "class A {\n" +
        // remove blank lines after opening brace
        "  computed int a;\n" +
        // remove blank lines before closing brace
        "}\n",
      "class A {\n" +
        // remove blank lines after opening brace
        "  computed int a;\n" +
        // remove blank lines before closing brace
        "}\n",
    );
  });
});
