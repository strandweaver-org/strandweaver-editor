import * as tokens from "@App/language/Tokens"
import { compileTokens } from "@App/language/Compiler"

describe('inline tags', () => {
  it('a knot with a tag after gets the tag', () => {
    const res = compileTokens([
      new tokens.Knot("start"),
      new tokens.InlineTag("ominous")
    ])

    expect(res).toCompileSuccessfully();
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

})

describe('standalone tags', () => {
  it('works right after a knot', () => {
    const res = compileTokens([
      new tokens.Knot("start"),
      new tokens.StandaloneTag("ominous")
    ])

    expect(res).toCompileSuccessfully();
    expect(res).toHaveElementValue(0, "getTags", ["ominous"])
  })

})