// import StrandLanguage from "../../../app/javascript/parser/StrandLanguage"
// TODO: currnetly including spec files in the webpack
import parser from "@App/language/Parser";
import * as P from 'parsimmon';
import * as tokens from '@App/language/Tokens';

function parse(text): P.Result<any> {
  return parser.Script.parse(text);
}

describe("choices", () => {
  it("get parsed into choices", () => {
    const res: P.Result<any> = parse(`\
You stare at the menu # beep boop # bick
* order the grilled cheese # beep # brap
  The grilled cheese is delicious. // is it tho?
* order the menu
  It's not tasty. Also people give you weird looks.
`);

    expect(res).toParseCorrectly();

    const success = (res as P.Success<any>);

    expect(success.value[0]).toBeATokenOfType('Paragraph');
    expect(success.value[0].getTags()).toStrictEqual(["beep boop", "bick"])
    expect(success.value[1]).toBeATokenOfType('Choice');

    const choice = (success.value[1] as tokens.Choice);
    expect(choice.text).toBe("order the grilled cheese");
    expect(choice.getTags()).toStrictEqual(["beep", "brap"])

    const paragraph = (success.value[2] as tokens.Paragraph);
    expect(paragraph.text).toBe("The grilled cheese is delicious.")
    expect(paragraph.indentLevel).toBe(2);
  });


})