// import StrandLanguage from "../../../app/javascript/parser/StrandLanguage"
// TODO: currnetly including spec files in the webpack
import strandParser from "@App/language/Parser";
import * as P from 'parsimmon';

describe("handling whitespace", () => {
  it("given a blank file", () => {
    const res = strandParser(``);

    expect(res).toParseCorrectly();

  })

  it("given empty lines", () => {
    const res = strandParser(`
    
    
    
=== begin ===
   
`);

    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeAKnotWithName("begin")

  })
})

describe("named knots", () => {
  it("given a knot with extra whitespace", () => {
    const res = strandParser(`=== opening_door === `);

    expect(res).toParseCorrectly();
  });


  it("given two knots", () => {
    const res = strandParser(`=== opening_door ===

=== xxx ===`);

    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeAKnotWithName("opening_door");
    expect(res.tokens[1]).toBeAKnotWithName("xxx");
  });

})

describe('tags', () => {
  it("an inline tag", () => {
    const res = strandParser(`Text test # beep `);
    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeATokenOfType("Paragraph");
    expect(res.tokens[0].getTags()).toStrictEqual(["beep"])

  })

  it("handles multiple tags", () => {
    const res = strandParser(`Text test # beep # boop `);
    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeATokenOfType("Paragraph");
    expect(res.tokens[0].getTags()).toStrictEqual(["beep", "boop"])
  })


  it("a tag after a knot", () => {
    const res = strandParser(`=== knotname ===
   # boop`);
    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeATokenOfType("Knot");
    expect(res.tokens[1]).toBeATokenOfType("StandaloneTag");

  })

})


describe('inline comments', () => {
  it("an inline works", () => {
    const res = strandParser(`Text test // beep`);
    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeATokenOfType("Paragraph");

  })

})

describe('single line comments', () => {
  it("a comment and a knot work", () => {
    const res = strandParser(`=== first_knot ===
  // yyy
  xxx`);
    expect(res).toParseCorrectly();
    expect(res.tokens[0]).toBeATokenOfType("Knot");
    expect(res.tokens[1]).toBeATokenOfType("Paragraph");

  })

})