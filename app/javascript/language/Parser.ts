import * as P from "parsimmon";
import * as tokens from "./Tokens"

function token(parser: P.Parser<any>) {
  return parser.skip(P.regexp(/[ \t]*/))
}

function StrandLanguage(indent: number): P.Language {
  return P.createLanguage({
    IndentedStatement: r =>
      P.seqMap(
        r.CountSpaces,
        r.Statement,
        r.InlineTags,
        r.InlineComment,
        r.OptionalSpacesAndTabs,
        P.newline,
        (spaces, statement, tags) => {
          tags.forEach((tag) => {
            statement.addTag(tag);
          })
          // TODO: add tags here
          statement.indentLevel = spaces;
          return statement;

        }
      ),


    InlineTags: () => P.regexp(/[\t ]*# ([^#\r\n]+)/, 1)
      .many()
      .map((tags) => {
        return tags.map((tag) => tag.trim())
      }),

    InlineComment: () => P.regexp(/(\/\/ (.+))?/),
    OptionalSpacesAndTabs: () => P.regexp(/[ \t]*/),
    CountSpaces: () => P.regexp(/^[ \t]*/).map(s => {
      return s.length;

    }),
    Statement: r => P.alt(
      r.Knot,
      r.StandaloneTag,
      r.Choice,
      r.StandaloneComment,
      r.Jump,
      r.Paragraph
    ),
    Script: r => r.IndentedStatement.many(),

    Choice: r => P.alt(
      P.regexp(/\* ([^\n\r]+?)[ \t]*(?=(#[\t ]*[^\n\r]*|\/\/[^\n\r]*))/, 1),
      P.regexp(/\* ([^\r\n]+)/, 1),
    )
      .chain(choiceText => {
        return P.succeed(new tokens.Choice(choiceText))
      }),

    Jump: r => P.regexp(/->[ \t]*([A-Za-z0-9_]+)/, 1).chain(location => {
      return P.succeed(new tokens.Jump(location))
    }).thru(token),

    Knot: r => P.regexp(/===[ ]+(.+)[ ]+===/, 1).chain(name => {
      return P.succeed(new tokens.Knot(name))
    }).thru(token),

    StandaloneComment: r => P.regexp(/^#[ \t]*\/\/ (.+)/, 1).chain((text) => {
      return P.succeed(new tokens.Comment(text))
    }).thru(token),

    StandaloneTag: r => P.regexp(/^#[ \t]+([^#\n\r]+)/, 1).chain((text) => {
      return P.succeed(new tokens.StandaloneTag(text.trim()))
    }),

    Paragraph: r =>
      P.alt(
        P.regexp(/([^\n\r]+?)[ \t]*(?=(#[\t ]*[^\n\r]*|\/\/[^\n\r]*|\<\>))/, 1),
        P.regexp(/[^\n\r]+/)
      )
        .chain((text) => {
          return P.succeed(new tokens.Paragraph(text.trim()));
        }),
  });
}

// Start parsing at zero indentation
const parser = StrandLanguage(0);

export default parser;
