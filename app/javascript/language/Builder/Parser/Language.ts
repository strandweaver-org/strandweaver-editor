import * as P from "parsimmon";
import * as tokens from "../Tokens";

const strandLanguage = P.createLanguage({
  IndentedStatement: r =>
    P.alt(
      P.seqMap(
        r.CountSpaces,
        r.Statement,
        r.InlineTags,
        r.InlineComment,
        r.OptionalSpacesAndTabs,
        r.GoToNextLineWithContent,
        (spaces, statement, tags) => {
          tags.forEach((tag: string) => {
            statement.addTag(tag);
          });
          // TODO: add tags here
          statement.indentLevel = spaces;
          return statement;
        }
      )
    ),

  InlineTags: () =>
    P.regexp(/[\t ]*# ([^#\r\n]+)/, 1)
      .many()
      .map(tags => {
        return tags.map(tag => tag.trim());
      }),

  GoToNextLineWithContent: () =>
    P.custom((success, _failure) => {
      return function(input, i) {
        let nextStartPoint = input.length;
        const whitespaceCodes = [9, 10, 13, 32];
        const newLineCodes = [10, 13];
        while (i < input.length) {
          const code = input.charCodeAt(i);
          if (whitespaceCodes.indexOf(code) == -1) {
            break;
          }

          if (newLineCodes.indexOf(code) >= 0) {
            nextStartPoint = i + 1;
          }

          i += 1;
        }

        return success(nextStartPoint, new tokens.BlankLine());
      };
    }),
  InlineComment: () => P.regexp(/([\t ]*\/\/ (.+))?/),
  OptionalSpacesAndTabs: () => P.regexp(/[ \t]*/),
  CountSpaces: () =>
    P.regexp(/^[ \t]*/).map(s => {
      return s.length;
    }),
  Statement: r =>
    P.alt(
      r.StandaloneComment,
      r.Knot,
      r.StandaloneTag,
      r.Choice,
      r.Jump,
      r.Paragraph
    ),
  EndOfFile: () =>
    P.seq(P.optWhitespace, P.end).chain(() => {
      return P.succeed(new tokens.BlankLine());
    }),
  Script: r => r.IndentedStatement.many().trim(P.optWhitespace),

  Choice: () =>
    P.alt(
      P.regexp(/\* ([^\n\r]+?)[ \t]*(?=(#[\t ]*[^\n\r]*|\/\/[^\n\r]*))/, 1),
      P.regexp(/\* ([^\r\n]+)/, 1)
    ).chain(choiceText => {
      return P.succeed(new tokens.Choice(choiceText));
    }),

  Jump: () =>
    P.regexp(/->[ \t]*([A-Za-z0-9_]+)/, 1).chain(location => {
      return P.succeed(new tokens.Jump(location));
    }),

  Knot: () =>
    P.regexp(/===[ ]+([^\r\n]+)[ ]+===/, 1).chain(name => {
      return P.succeed(new tokens.Knot(name));
    }),

  StandaloneComment: () =>
    P.regexp(/\/\/ [^\n\r]+/, 1).chain(text => {
      return P.succeed(new tokens.StandaloneComment(text));
    }),

  StandaloneTag: () =>
    P.regexp(/^#[ \t]+([^#\n\r]+)/, 1).chain(text => {
      return P.succeed(new tokens.StandaloneTag(text.trim()));
    }),

  Paragraph: () =>
    P.alt(
      P.regexp(/([^\n\r]+?)[ \t]*(?=(#[\t ]*[^\n\r]*|\/\/[^\n\r]*|\<\>))/, 1),
      P.regexp(/[^\n\r]+/)
    ).chain(text => {
      return P.succeed(new tokens.Paragraph(text.trim()));
    })
});

export default strandLanguage;
