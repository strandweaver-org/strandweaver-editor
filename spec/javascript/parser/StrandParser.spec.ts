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
    expect((res as P.Success<any>).value[0]).toBeAKnot();
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

  it("given a knot with an invalid name", () => {
    const res = parse(`=== Boop Beep === `);
    expect(res).not.toBeAValidScript();
    expect(res).toContainScriptError("INVALID_KNOT_NAME");

  })

})

describe('single line comments', () => {

})