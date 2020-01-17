import * as tokens from "@App/language/Tokens"
import * as elements from "@App/language/Elements"
import Parser from "./Parser"
import * as P from "parsimmon"

export interface ICompilerResponse {
  success: boolean
  elements: elements.BaseElement[]
  errors: string[]
}

const COMPILER_ERRORS = {
  INVALID_KNOT_NAME: (v: string) => `${v} is an invalid knot name.\nKnot names must be only letters, numbers, and an underscore`
}

function errorMsg(constant: string, value: string) {
  const errorGen = COMPILER_ERRORS[constant];

  if (errorGen) {
    return `${constant}: ${errorGen(value)}`
  } else {
    return `INVALID_ERROR_TYPE: Error type ${constant}`
  }
}

export function compileScript(script: string): ICompilerResponse {
  const res = Parser.Script.parse(script)
  if (res.status == false) {
    const failure = (res as P.Failure);
    return {
      success: false,
      elements: [],
      errors: [`Parsing failed due to ${failure.expected.join("\n")}`]
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

  const response: ICompilerResponse = {
    success: true,
    errors: [],
    elements: []
  }
  const tokenLength: number = tokens.length

  function setCurrentKnot() {
    currentKnot = new elements.Knot((currentToken as tokens.Knot).name)
    currentDisplayElement = currentKnot;
    response.elements.push(currentDisplayElement);


    if (beginningAddress == null) {
      beginningAddress = currentKnot.name
    }
  }

  function setCurrentParagraph() {
    if (currentKnot == null) {
      currentKnot = new elements.Knot();
      response.elements.push(currentKnot);
    }

    currentDisplayElement = new elements.Paragraph((currentToken as tokens.Paragraph).text)
    response.elements.push(currentDisplayElement);
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


  while (tokenIndex < tokens.length) {
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


      case "Paragraph":
        setCurrentParagraph();
        break;


    }

    tokenIndex += 1
  }

  return response;


}