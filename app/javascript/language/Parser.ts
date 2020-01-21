import * as P from "parsimmon";
import * as tokens from "./Tokens"

function token(parser: P.Parser<any>) {
  return parser.skip(P.optWhitespace)
}

function StrandLanguage(indent: number): P.Language {
  return P.createLanguage({
    IndentedStatement: r =>
      P.alt(
        P.seqMap(
          r.CountSpaces,
          r.Statement,
          (spaces, statement) => {
            statement.indentLevel = spaces;
            return statement;

          }
        ),
        r.Statement
      ),

    CountSpaces: () => P.regexp(/^\s*/).map(s => s.length),
    Statement: r => P.alt(
      r.Knot,
      r.StandaloneTag,
      r.InlineTag,
      r.Comment,
      r.Jump,
      r.Paragraph
    ),
    Script: r => r.IndentedStatement.many(),

    Jump: r => P.regexp(/->\s*([A-Za-z0-9_]+)/, 1).chain(location => {
      return P.succeed(new tokens.Jump(location))
    }).thru(token),

    Knot: r => P.regexp(/===[ ]+(.+)[ ]+===/, 1).chain(name => {
      return P.succeed(new tokens.Knot(name))
    }).thru(token),

    Comment: r => P.regexp(/\/\/ (.+)/, 1).chain((text) => {
      return P.succeed(new tokens.Comment(text))
    }).thru(token),

    StandaloneTag: r => P.regexp(/^#\s+([^#\n\r]+)/, 1).chain((text) => {
      return P.succeed(new tokens.StandaloneTag(text.trim()))
    }),

    Paragraph: r =>
      P.alt(
        P.regexp(/([^\n\r]+?)\s*(?=(#\s*[^\n\r]*|\/\/[^\n\r]*|\<\>))/),
        P.regexp(/[^\n\r]+/)
      )
        .chain((text) => {
          return P.succeed(new tokens.Paragraph(text.trim()));
        }).thru(token),


    InlineTag: r =>
      P.regex(/#\s+([^#\n\r]+)/, 1)
        .chain(val => {
          return P.succeed(new tokens.InlineTag(val.trim()));
        }),

  });
}

// Start parsing at zero indentation
const parser = StrandLanguage(0);

export default parser;
