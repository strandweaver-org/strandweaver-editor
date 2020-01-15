import * as tokens from "@App/language/Tokens"
import compileTokens, { ICompilerResponse } from "@App/language/Compiler"

it('with a simple program', () => {
  const res = compileTokens([
    new tokens.Knot("start")
  ])

  expect(res).toHaveElementValue(0, "type", "Knot")
  expect(res).toHaveElementValue(0, "name", "start")
})

it('a knot with a tag after gets the tag', () => {
  const res = compileTokens([
    new tokens.Knot("start"),
    new tokens.Tag("ominous")
  ])

  expect(res).toHaveNoCompilationErrors();
  expect(res).toHaveElementValue(0, "getTags", ["ominous"])
})

it('a knot with multiple tag after it gets both tags', () => {
  const res = compileTokens([
    new tokens.Knot("start"),
    new tokens.Tag("ominous"),
    new tokens.Tag("moody.mp3")
  ])

  expect(res).toHaveNoCompilationErrors();
  expect(res).toHaveElementValue(0, "getTags", ["ominous", "moody.mp3"])
})