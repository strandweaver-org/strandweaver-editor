import * as tokens from "@App/language/Tokens"
import * as elements from "@App/language/Elements"
import Parser from "./Parser"
import * as P from "parsimmon"
import Engine from "./Engine"

export interface ICompilerMessage {
  category: string;
  type: string;
  text: string;
}

export interface ICompilerResponse {
  success: boolean;
  engine?: Engine;
  messages: ICompilerMessage[];
}

export const validKnotNameRegex = /^[A-Za-z][A-Za-z_0-9]*$/

const COMPILER_MESSAGES = {
  INVALID_KNOT_NAME: ['error', (v: string) => `${v} is an invalid knot name.\nKnot names must start with a letter and contain only letters, numbers, and underscores`],
  KNOT_CANNOT_BE_DONE: ['error', (v: string) => `The knot name DONE is reserved for ending a story.`],
  JUMP_LOCATION_NOT_FOUND: ['error', (v: string) => `Attempt to jump to a location ${v} that was not specified.`]
}

export function compileScript(script: string): ICompilerResponse {
  const res = Parser.Script.parse(script)
  if (res.status == false) {
    const failure = (res as P.Failure);
    return {
      success: false,
      messages: [
        {
          category: 'error', type: "PARSING_FAILED",
          text: `Parsing failed due to ${failure.expected.join("\n")}`
        }
      ]
    }

  }

  const parseRes: P.Success<any> = (res as P.Success<any>)
  return compileTokens(parseRes.value)
}

export function compileTokens(tokens: tokens.BaseToken[]): ICompilerResponse {
  let currentKnot: elements.Knot | null = null
  let beginningAddress: string | null = null
  let tokenIndex: number = 0;
  let currentToken: tokens.BaseToken = null;
  let currentDisplayElement: elements.BaseElement | null = null;
  let currentStandaloneKnotTags: string[] = []

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

  const response: ICompilerResponse = {
    success: true,
    messages: [],
    engine: new Engine()
  }
  const tokenLength: number = tokens.length

  function setCurrentKnot(): void {
    const knotName: string = (currentToken as tokens.Knot).name;
    if (!validKnotNameRegex.test(knotName)) {
      addMessage("INVALID_KNOT_NAME", knotName);
      return
    }

    if (knotName.toUpperCase() == "DONE") {
      addMessage("KNOT_CANNOT_BE_DONE", knotName);
      return
    }

    currentKnot = new elements.Knot((currentToken as tokens.Knot).name)
    currentDisplayElement = currentKnot;
    response.engine.addElement(currentDisplayElement);


    if (beginningAddress == null) {
      beginningAddress = currentKnot.name
    }
  }

  function setCurrentParagraph() {
    if (currentKnot == null) {
      currentKnot = new elements.Knot();
      response.engine.addElement(currentKnot);
    }

    currentDisplayElement = new elements.Paragraph((currentToken as tokens.Paragraph).text)
    response.engine.addElement(currentDisplayElement);
  }

  function addInlineTag(): void {
    switch (currentDisplayElement.type) {
      case "Knot":
        currentDisplayElement.addTag((currentToken as tokens.InlineTag).value);
        break;

      case "Paragraph":
        currentDisplayElement.addTag((currentToken as tokens.InlineTag).value);
        break;
    }
  }

  function addJump(): void {
    response.engine.addElement(new elements.Jump((currentToken as tokens.Jump).location))
  }

  function addStandaloneTag(): void {
    switch (currentDisplayElement.type) {
      case "Knot":
        currentDisplayElement.addTag((currentToken as tokens.InlineTag).value);
        break;

      case "Paragraph":
        currentDisplayElement.addTag((currentToken as tokens.InlineTag).value);
        break;
    }
  }

  function validateEngine(): void {
    checkAllJumpsAreValid()
  }

  function checkAllJumpsAreValid(): void {
    response.engine.elementList.forEach(element => {
      if (element.type !== "Jump") {
        return;
      }

      const jump = (element as elements.Jump);
      if (response.engine.locationMap[jump.location]) {
        return
      }

      addMessage("JUMP_LOCATION_NOT_FOUND", jump.location)
    })
  }

  while (tokenIndex < tokens.length && response.success === true) {
    currentToken = tokens[tokenIndex];

    switch (currentToken.type) {
      case "Knot":
        setCurrentKnot();
        break;

      case "InlineTag":
        addInlineTag();
        break;

      case "StandaloneTag":
        addStandaloneTag();
        break;

      case "Jump":
        addJump();

      case "Paragraph":
        setCurrentParagraph();
        break;


    }

    tokenIndex += 1
  }

  if (response.success === true) {
    validateEngine()

  }

  return response;


}