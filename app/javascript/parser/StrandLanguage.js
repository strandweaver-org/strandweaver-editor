import * as P from "parsimmon";

const PARSER_ERRORS = {
  INVALID_KNOT_NAME: (v) => `${v} is an invalid knot name.\nKnot names must be only letters, numbers, and an underscore`
}

function errorMsg(constant, value) {
  const errorGen = PARSER_ERRORS[constant];

  if (errorGen) {
    return `${constant}: ${errorGen(value)}`
  } else {
    return `INVALID_ERROR_TYPE: Error type ${constant}`
  }
}

let knotAutoNameNumber = 0;
function generateKnot(name) {
  let knotName = name;
  if (knotName == undefined) {
    knotAutoNameNumber += 1;
    knotName = `k_${knotAutoNameNumber}`;
  }

  return [["knot", knotName]]
}

function token(parser) {
  return parser.skip(P.whitespace)
}

function StrandLanguage(indent) {
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
        ["n", r.IndentMore],
        ["first", r.Statement]
      ).chain(args => {
        const { n, first } = args;
        return StrandLanguage(n)
          .RestStatement.many()
          .map(rest => ["BLOCK", first, ...rest]);
      }),

    // This is just a statement in our language. To simplify, this is either a
    // block of code or just an identifier
    Statement: r => P.alt(r.Knot),

    Knot: r => P.regexp(/===\s+(.+)\s+===/, 1).chain(name => {
      if (/^[A-Za-z0-9_]+$/.test(name)) {
        return P.succeed([["knot", name]])
      } else {
        return P.fail(errorMsg("INVALID_KNOT_NAME", name))
      }
    }).thru(token).skip(r.End),

    Text: r => P.regexp(/.*/),

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
