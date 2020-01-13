import * as tokens from "@App/language/Tokens"
import compileTokens, { ICompilerResponse } from "@App/language/Compiler"

it('with a simple program', () => {
  const res = compileTokens([
    new tokens.Knot("start")
  ])

  expect(res).toHaveNoCompilationErrors();
})