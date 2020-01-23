import * as tokens from "@App/language/Tokens"
import { compileTokens } from "@App/language/Compiler"

describe('knots', () => {
  it('a knot with a malformed name gets rejected', () => {
    const res = compileTokens([
      new tokens.Knot("start!"),
    ])

    expect(res).toContainCompilationMessageOfType("INVALID_KNOT_NAME")
  })

  it('a knot with done as its name gets rejected', () => {
    const res = compileTokens([
      new tokens.Knot("done"),
    ])

    expect(res).toContainCompilationMessageOfType("KNOT_CANNOT_BE_DONE")
  })


})