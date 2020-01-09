import StrandLanguage from "parser/StrandLanguage";

function parse(text) {
  return StrandLanguage.Statement.parse(text);
}

it("given a knot with extra whitespace", () => {
  const res = parse(`=== opening_door === `);

  expect(res).toBeAValidScript();
  expect(res.value[0]).toBeAKnot("opening_door")
});

it("given a knot", () => {
  const res = parse(`=== opening_door ===\n`);

  expect(res).toBeAValidScript();
  expect(res.value[0]).toBeAKnot("opening_door")
});

it("given a knot with an invalid name", () => {
  const res = parse(`=== Boop Beep === `);
  expect(res).not.toBeAValidScript();
  expect(res).toContainScriptError("INVALID_KNOT_NAME");

})