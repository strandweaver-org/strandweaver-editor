// import StrandLanguage from "../../../app/javascript/parser/StrandLanguage"
// TODO: currnetly including spec files in the webpack
import parser from "@App/language/Parser";
import * as P from 'parsimmon';

function parse(text): P.Result<any> {
  return parser.Script.parse(text);
}

describe("jumps", () => {
  it("get parsed correctly ", () => {
    const res: P.Result<any> = parse(`\
=== morning ===
You get coffee.
-> lunch

=== lunch ===
You eat a grilled cheese.
`);

    expect(res).toParseCorrectly();

    const success = res as P.Success<any>;
    expect(success.value[2]).toBeATokenOfType('Jump');
  });


})