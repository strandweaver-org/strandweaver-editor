import * as P from "parsimmon";
import * as tokens from "./Tokens"
import strandLanguage from "./ParserLanguage"

export interface IParserResponse {
  success: boolean;
  messages: IParserMessage[];
  tokens: tokens.BaseToken[];
}

export interface IParserMessageLocation {
  offset: number;
  line: number;
  column: number;
}

export interface IParserMessage {
  category: string;
  type: string;
  text: string;
  location?: IParserMessageLocation;
}

export default function strandParser(text: string): IParserResponse {
  const response: IParserResponse = {
    success: false,
    messages: [],
    tokens: []

  }

  const parseResult = strandLanguage.Script.parse(text)

  if (parseResult.status === true) {
    response.success = true;
    const success = parseResult as P.Success<any>;
    const tokens = success.value;

    response.tokens = tokens.filter((token: tokens.BaseToken) =>
      token.type !== 'StandaloneComment' && token.type !== 'BlankLine')
  } else {
    response.success = false;
    const failure = parseResult as P.Failure;
    response.messages = [
      {
        category: 'error',
        type: 'PARSE_ERROR',
        text: failure.expected.join("\n"),
        location: failure.index
      }
    ]
  }

  return response
}
