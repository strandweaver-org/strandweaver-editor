// import StrandLanguage from "../../../app/javascript/parser/StrandLanguage"
// TODO: currnetly including spec files in the webpack
import strandParser from "@App/language/Parser";
import * as P from 'parsimmon';
import * as tokens from '@App/language/Tokens';

describe("jumps", () => {
  it("get parsed correctly", () => {
    const res = strandParser(`\

-> brook

=== beep ===
This is a sound.
-> END

=== brook ===
This is a body of water.
-> END
`);

    expect(res).toParseCorrectly();

    expect(res.tokens[0]).toBeATokenOfType('Jump');
    expect(res.tokens[1]).toBeATokenOfType('Knot');
    expect(res.tokens[2]).toBeATokenOfType('Paragraph');
  });


})