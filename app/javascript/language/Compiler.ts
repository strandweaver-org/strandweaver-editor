import * as tokens from "@App/language/Tokens"
import * as elements from "@App/language/Elements"

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

export default function compileTokens(tokens: tokens.BaseToken[]): ICompilerResponse {
  let currentKnot: elements.Knot | null = null
  let beginningAddress: string | null = null
  let tokenIndex: number = 0;
  let currentToken: tokens.BaseToken = null;
  let currentDisplayElement: elements.BaseElement | null = null;

  const response: ICompilerResponse = {
    success: true,
    errors: [],
    elements: []
  }
  const tokenLength: number = tokens.length

  function wrapupCurrentKnot() {
    if (currentKnot == null) {
      return;
    }
    response.elements.push(currentKnot);
  }

  function setCurrentKnot() {
    wrapupCurrentKnot();
    currentKnot = new elements.Knot((currentToken as tokens.Knot).name)
    currentDisplayElement = currentKnot;


    if (beginningAddress == null) {
      beginningAddress = currentKnot.name
    }
  }

  function addTag() {
    if (currentDisplayElement.type == "Knot") {
      currentDisplayElement.addTag((currentToken as tokens.Tag).value)
    }
  }

  while (tokenIndex < tokens.length) {
    currentToken = tokens[tokenIndex];

    switch (currentToken.type) {
      case "Knot":
        setCurrentKnot();
        break;

      case "Tag":
        addTag();
        break;

    }

    tokenIndex += 1
  }

  wrapupCurrentKnot();
  return response;


}