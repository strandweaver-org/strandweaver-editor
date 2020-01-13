import * as tokens from "@App/language/Tokens"
import * as elements from "@App/language/Elements"

export interface ICompilerResponse {
  success: boolean
  elements: Element[]
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
  const currentKnot: null = null
  const beginningAddress: string | null = null

  return {
    success: true,
    elements: [],
    errors: []
  }


}