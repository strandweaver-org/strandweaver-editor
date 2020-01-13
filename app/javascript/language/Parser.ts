import * as P from "parsimmon";
import { Knot, Paragraph, Comment } from "./Tokens"
import Tag from "./Tokens/Tag";

const PARSER_ERRORS = {
  INVALID_KNOT_NAME: (v: string) => `${v} is an invalid knot name.\nKnot names must be only letters, numbers, and an underscore`
}

function errorMsg(constant: string, value: string) {
  const errorGen = PARSER_ERRORS[constant];

  if (errorGen) {
    return `${constant}: ${errorGen(value)}`
  } else {
    return `INVALID_ERROR_TYPE: Error type ${constant}`
  }
}

function token(parser: P.Parser<any>) {
  return parser.skip(P.optWhitespace)
}

function StrandLanguage(indent: number): P.Language {
  return P.createLanguage({
    // This is where the magic happens. Basically we need to parse a deeper
    // indentation level on the first statement of the block and keep track of
    // new indentation level. Then we make a whole new set of parsers that use
    // that new indentation level for all their parsing. Each line past the
    // first is required to be indented to the same level as that new deeper
    // indentation level.
    Block: r =>
      P.seqObj(
        P.string("block:"),
        r.NL,
        ["n" as never, r.IndentMore as P.Parser<never>],
        ["first" as never, r.Statement as P.Parser<never>]
      ).chain(args => {
        const { n, first } = args as any;
        return StrandLanguage(n)
          .RestStatement.many()
          .map(rest => ["BLOCK", first, ...rest]);
      }),

    // This is just a statement in our language. To simplify, this is either a
    // block of code or just an identifier
    Statement: r => P.alt(r.Knot, r.Tag, r.Comment, r.Paragraph),
    Script: r => r.Statement.many(),

    Knot: r => P.regexp(/===[ ]+(.+)[ ]+===/, 1).chain(name => {
      return P.succeed(new Knot(name))
    }).thru(token),

    Comment: r => P.regexp(/\/\/ (.+)/, 1).chain((text) => {
      return P.succeed(new Comment(text))
    }).thru(token),

    Paragraph: r =>
      P.alt(
        P.regexp(/([^\n\r]+?)\s*(?=(#\s*[^\n\r]*|\/\/[^\n\r]*|\<\>))/),
        P.regexp(/.+/)
      )
        .chain(text => {
          return P.succeed(new Paragraph(text));
        }).thru(token),


    Tag: r =>
      P.regex(/#\s+([^#\n\r]+)/, 1)
        .chain(val => {
          return P.succeed(new Tag(val.trim()));
        }),

    // This is a statement which is indented to the level of the current parse
    // state. It's called RestStatement because the first statement in a block
    // is indented more than the previous state, but the *rest* of the
    // statements match up with the new state.
    RestStatement: r => r.IndentSame.then(r.Statement),

    // Just a variable and then the end of the line.
    Ident: r => P.regexp(/[a-z]+/i).skip(r.End),

    // Consume zero or more spaces and then return the number consumed. For a
    // more Python-like language, this parser would also accept tabs and then
    // expand them to the correct number of spaces
    //
    // https://docs.python.org/3/reference/lexical_analysis.html#indentation
    CountSpaces: () => P.regexp(/[ ]*/).map(s => s.length),

    // Count the current indentation level and assert it's more than the current
    // parse state's desired indentation
    IndentSame: r =>
      r.CountSpaces.chain(n => {
        if (n === indent) {
          return P.of(n);
        }
        return P.fail(`${n} spaces`);
      }),

    // Count the current indentation level and assert it's equal to the current
    // parse state's desired indentation
    IndentMore: r =>
      r.CountSpaces.chain(n => {
        if (n > indent) {
          return P.of(n);
        }
        return P.fail(`more than ${n} spaces`);
      }),

    // Support all three standard text file line endings
    NL: () => P.alt(P.string("\r\n"), P.oneOf("\r\n")),

    // Lines should always end in a newline sequence, but many files are missing
    // the final newline
    End: r => P.alt(r.NL, P.eof),
  });
}

// Start parsing at zero indentation
const StrandParser = StrandLanguage(0);

export default StrandParser;
