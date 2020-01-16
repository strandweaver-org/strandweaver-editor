import * as tokens from "@App/language/Tokens"
import { compileTokens, compileScript, ICompilerResponse } from "@App/language/Compiler"

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
    new tokens.InlineTag("ominous")
  ])

  expect(res).toHaveNoCompilationErrors();
  expect(res).toHaveElementValue(0, "getTags", ["ominous"])
})

it('a knot with multiple tag after it gets both tags', () => {
  const res = compileTokens([
    new tokens.Knot("start"),
    new tokens.InlineTag("ominous"),
    new tokens.InlineTag("moody.mp3")
  ])

  expect(res).toHaveElementValue(0, "getTags", ["ominous", "moody.mp3"])
})

it('the second knot does not get the tags of the knot before', () => {
  const res = compileTokens([
    new tokens.Knot("start"),
    new tokens.InlineTag("ominous"),
    new tokens.InlineTag("moody.mp3"),
    new tokens.Knot("middle"),
    new tokens.Knot("end")
  ])

  expect(res).toHaveElementValue(0, "getTags", ["ominous", "moody.mp3"])

  expect(res).toHaveElementValue(1, "name", "middle")
  expect(res).toHaveElementValue(1, "getTags", [])

  expect(res).toHaveElementValue(2, "name", "end")
  expect(res).toHaveElementValue(2, "getTags", [])
})

it('paragraphs can have tags', () => {
  const res = compileTokens([
    new tokens.Knot("start"),
    new tokens.Paragraph("The forest looms."),
    new tokens.InlineTag("ominous"),
    new tokens.InlineTag("moody.mp3")
  ])

  expect(res).toHaveElementValue(0, "name", "start")
  expect(res).toHaveElementValue(0, "getTags", [])
  expect(res).toHaveElementValue(1, "type", "Paragraph")
  expect(res).toHaveElementValue(1, "getTags", ["ominous", "moody.mp3"])
})

it('comments are skipped', () => {
  const res = compileScript(`\
// beep
// boop
=== start === // in-line comment
paragraph text // another in-line comment
// xxx
// fff
end text
`)

  expect(res).toHaveElementValue(0, "type", "Knot")
  expect(res).toHaveElementValue(0, "name", "start")
  expect(res).toHaveElementValue(1, "type", "Paragraph")
  expect(res).toHaveElementValue(1, "text", "paragraph text")
  expect(res).toHaveElementValue(2, "type", "Paragraph")
  expect(res).toHaveElementValue(2, "text", "end text")
})