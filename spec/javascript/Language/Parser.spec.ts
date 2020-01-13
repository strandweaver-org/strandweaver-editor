// import StrandLanguage from "../../../app/javascript/parser/StrandLanguage"
// TODO: currnetly including spec files in the webpack
import parser from "@App/language/Parser";
import * as P from 'parsimmon';

function parse(text): P.Result<any> {
  return parser.Script.parse(text);
}

describe("named knots", () => {
  it("given a knot with extra whitespace", () => {
    const res: P.Result<any> = parse(`=== opening_door === `);

    expect(res).toParseCorrectly();

    const success = res as P.Success<any>;
    expect(success.value[0]).toBeATokenOfType('Knot');
  });

  it("given two knots", () => {
    const res = parse(`=== opening_door ===
=== xxx ===
`);

    expect(res).toParseCorrectly();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeAKnotWithName("opening_door");
    expect(success.value[1]).toBeAKnotWithName("xxx");
  });

})

describe('tags', () => {
  it("an inline tag", () => {
    const res = parse(`Text test # beep `);
    expect(res).toParseCorrectly();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeATokenOfType("Paragraph");
    expect(success.value[1]).toBeATokenOfType("Tag");
    expect(success.value[1].value).toBe('beep')

  })

  it("handles multiple tags", () => {
    const res = parse(`Text test # beep # boop `);
    expect(res).toParseCorrectly();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeATokenOfType("Paragraph");
    expect(success.value[1]).toBeATokenOfType("Tag");
    expect(success.value[1].value).toBe('beep')
    expect(success.value[2]).toBeATokenOfType("Tag");
    expect(success.value[2].value).toBe('boop')

  })


  it("a tag after a knot", () => {
    const res = parse(`=== knotname ===
 # boop`);
    expect(res).toParseCorrectly();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeATokenOfType("Knot");
    expect(success.value[1]).toBeATokenOfType("Tag");

  })

})


describe('inline comments', () => {
  it("an inline works", () => {
    const res = parse(`Text test // beep`);
    expect(res).toParseCorrectly();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeATokenOfType("Paragraph");
    expect(success.value[1]).toBeATokenOfType("Comment");

  })

})

describe('single line comments', () => {
  it("a comment and a knot work", () => {
    const res = parse(`=== first_knot ===
// yyy
xxx`);
    expect(res).toParseCorrectly();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeATokenOfType("Knot");
    expect(success.value[1]).toBeATokenOfType("Comment");
    expect(success.value[2]).toBeATokenOfType("Paragraph");

  })

})