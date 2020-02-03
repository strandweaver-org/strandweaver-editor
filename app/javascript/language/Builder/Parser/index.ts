import P from "parsimmon";
import * as tokens from "../Tokens";
import strandLanguage from "./Language";
import { BuildResponse } from "../Response";
import { BuildMessageType } from "../Messages";

export default function strandParser(text: string): BuildResponse {
  const response = new BuildResponse();

  const parseResult = strandLanguage.Script.parse(text);

  if (parseResult.status === true) {
    const success = parseResult as P.Success<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    const parsedTokens = success.value;

    response.tokens = parsedTokens.filter(
      (token: tokens.BaseToken) =>
        token.type !== "StandaloneComment" && token.type !== "BlankLine"
    );
  } else {
    const failure = parseResult as P.Failure;
    response.addMessage(
      BuildMessageType.ParseError,
      failure.expected.join("\n"),
      failure.index
    );
  }

  return response;
}
