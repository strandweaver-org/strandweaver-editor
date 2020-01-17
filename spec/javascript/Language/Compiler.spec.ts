import * as tokens from "@App/language/Tokens"
import { compileTokens, compileScript, ICompilerResponse } from "@App/language/Compiler"

it('with a simple program', () => {
  const res = compileTokens([
    new tokens.Knot("start")
  ])

  expect(res).toHaveElementValue(0, "type", "Knot")
  expect(res).toHaveElementValue(0, "name", "start")
})
