import { Token } from "@App/language/Tokens"

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

export default class Compiler {
  constructor(Element[]) {

  }
}