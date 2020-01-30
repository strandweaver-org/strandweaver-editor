import * as tokens from "@App/language/Tokens"
import strandParser, { IParserMessageLocation } from "./Parser"
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
  KNOT_NAME_RESERVED: ['error', () => `The knot name DONE or END is reserved for ending a story.`],
  KNOT_NAME_ALREADY_DEFINED: ['error', (v: string) => `The knot name ${v} has already been defined.`],
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
  function addMessage(messageType: string, value?: string): void {
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

  const indentStack: [number, BaseObject][] = [];

  engine.root = new BaseObject("Container", engine);
  const startContainer = engine.root.createSubObject("Container");
  startContainer.location = "#start";
  indentStack.push([0, engine.root]);

  engine.registerObjectLocation(startContainer);
  let currentContainer = startContainer;

  function checkKnotHasValidName(knotToken: tokens.Knot): void {
    const name = knotToken.name;

    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
      addMessage("INVALID_KNOT_NAME", knotToken.name);
    }

    if (name.toLowerCase() == "done" || name.toLowerCase() == "end") {
      addMessage("KNOT_NAME_RESERVED", knotToken.name);
    }

    if (name in engine.locationMap) {
      addMessage("KNOT_NAME_ALREADY_DEFINED", knotToken.name);
    }
  }

  function registerNewKnot(knotToken: tokens.Knot) {
    checkKnotHasValidName(knotToken);

    const newContainer = engine.root.createSubObject("Container");
    newContainer.location = knotToken.name;
    engine.registerObjectLocation(newContainer);
    currentContainer = newContainer;
  }

  function registerNewJump(jumpToken: tokens.Jump) {
    const jumpObject = currentContainer.createSubObject("Jump");
    jumpObject.props["destination"] = jumpToken.location;
  }

  let tokenIndex: number = 0;
  const tokenLength: number = tokens.length
  while (tokenIndex < tokenLength && response.success === true) {
    const currentToken = tokens[tokenIndex];

    switch (currentToken.type) {
      case "Knot":
        const knotToken = (currentToken as tokens.Knot);
        registerNewKnot(knotToken);

        break;

      case "Jump":
        const jumpToken = (currentToken as tokens.Jump);
        registerNewJump(jumpToken);
        break;

    }

    tokenIndex += 1
  }


  if (response.success == true) {
    const endStory = engine.root.createSubObject("EndStory");
    endStory.location = "#end"
    engine.locationMap["DONE"] = endStory;
    engine.locationMap["END"] = endStory;
    engine.validate(addMessage);
  }

  return response;
}