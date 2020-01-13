import * as P from "parsimmon";
import * as tokens from "./Tokens"
import Tag from "./Tokens/Tag";

function token(parser: P.Parser<any>) {
  return parser.skip(P.optWhitespace)
}

function StrandLanguage(indent: number): P.Language {
  return P.createLanguage({
    Statement: r => P.alt(r.Knot, r.Tag, r.Comment, r.Paragraph),
    Script: r => r.Statement.many(),

    Knot: r => P.regexp(/===[ ]+(.+)[ ]+===/, 1).chain(name => {
      return P.succeed(new tokens.Knot(name))
    }).thru(token),

    Comment: r => P.regexp(/\/\/ (.+)/, 1).chain((text) => {
      return P.succeed(new tokens.Comment(text))
    }).thru(token),

    Paragraph: r =>
      P.alt(
        P.regexp(/([^\n\r]+?)\s*(?=(#\s*[^\n\r]*|\/\/[^\n\r]*|\<\>))/),
        P.regexp(/.+/)
      )
        .chain(text => {
          return P.succeed(new tokens.Paragraph(text));
        }).thru(token),


    Tag: r =>
      P.regex(/#\s+([^#\n\r]+)/, 1)
        .chain(val => {
          return P.succeed(new tokens.Tag(val.trim()));
        }),

  });
}

// Start parsing at zero indentation
const parser = StrandLanguage(0);

export default parser;
