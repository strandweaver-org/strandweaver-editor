import StrandLanguage from "parser/StrandLanguage";

it("given plain text", () => {
  const text = `\
block:
  alpha
  bravo
  block:
         charlie
         delta
         echo
         block:
          foxtrot
  golf
`;
  const res = StrandLanguage.Statement.parse(text);

  expect(res).toBe("x");
});
