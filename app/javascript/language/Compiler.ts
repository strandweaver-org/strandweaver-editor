import * as tokens from "@App/language/Tokens"
import * as elements from "@App/language/Elements"
import strandParser, { IParserMessageLocation } from "./Parser"
import * as P from "parsimmon"
import Engine from "./Engine"
import BaseObject from "./Objects/BaseObject"

export interface ICompilerMessage {
  category: string;
  type: string;
  text: string;
  location?: IParserMessageLocation;
}

export interface ICompilerResponse {
  success: boolean;
  engine: Engine;
  messages: ICompilerMessage[];
}

export const validKnotNameRegex = /^[A-Za-z][A-Za-z_0-9]*$/


const COMPILER_MESSAGES: { [key: string]: [string, (v: string) => string] } = {
  INVALID_KNOT_NAME: ['error', (v: string) => `${v} is an invalid knot name.\nKnot names must start with a letter and contain only letters, numbers, and underscores`],
  KNOT_CANNOT_BE_DONE: ['error', (v: string) => `The knot name DONE is reserved for ending a story.`],
  JUMP_LOCATION_NOT_FOUND: ['error', (v: string) => `Attempt to jump to a location ${v} that was not specified.`]
}

export function compileScript(script: string): ICompilerResponse {
  const res = strandParser(script)
  if (res.success === false) {
    return {
      success: false,
      messages: res.messages,
      engine: new Engine()
    }

  }

  return compileTokens(res.tokens);
}

export function compileTokens(tokens: tokens.BaseToken[]): ICompilerResponse {
  function addMessage(messageType: string, value: string | null): void {
    const [category, messageGen] = COMPILER_MESSAGES[messageType];

    if (category) {
      response.messages.push({
        category,
        type: messageType,
        text: messageGen(value || "")
      })

    } else {
      response.messages.push({
        category: 'error',
        type: 'INVALID_ERROR_TYPE',
        text: `An error of type ${messageType} was requested, but not found`

      })
    }

    if (category === "error") {
      response.success = false
    }
  }

  const engine = new Engine()
  const response: ICompilerResponse = {
    success: true,
    messages: [],
    engine: engine
  }

  engine.strandVersion = "1"
  const tokenLength: number = tokens.length
  let tokenIndex: number = 0;

  const currentContainer = new BaseObject("Container", engine);
  currentContainer.location = "#start"
  const currentIndent: number = 0;
  engine.registerElementLocation(currentContainer);

  while (tokenIndex < tokens.length && response.success === true) {
    const currentToken = tokens[tokenIndex];

    tokenIndex += 1
  }


  return response;


}