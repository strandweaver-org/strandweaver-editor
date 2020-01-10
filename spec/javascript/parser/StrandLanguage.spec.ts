// import StrandLanguage from "../../../app/javascript/parser/StrandLanguage"
// TODO: currnetly including spec files in the webpack
import StrandLanguage from "@App/parser/StrandLanguage";
import * as P from 'parsimmon';

function parse(text): P.Result<any> {
  return StrandLanguage.Script.parse(text);
}

describe("named knots", () => {
  it("given a knot with extra whitespace", () => {
    const res: P.Result<any> = parse(`=== opening_door === `);

    expect(res).toBeAValidScript();

    const success = res as P.Success<any>;
    expect(success.value[0]).toBeAnElementOfType('Knot');
  });

  it("given two knots", () => {
    const res = parse(`=== opening_door ===
=== xxx ===
`);

    expect(res).toBeAValidScript();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeAKnotWithName("opening_door");
    expect(success.value[1]).toBeAKnotWithName("xxx");
  });

})

describe('single line comments', () => {
  it("a comment and a knot work", () => {
    const res = parse(`=== first_knot ===
// yyy
xxx`);
    expect(res).toBeAValidScript();
    const success = res as P.Success<any>;
    expect(success.value[0]).toBeAnElementOfType("Knot");
    expect(success.value[1]).toBeAnElementOfType("Comment");
    expect(success.value[2]).toBeAnElementOfType("Paragraph");

  })

})