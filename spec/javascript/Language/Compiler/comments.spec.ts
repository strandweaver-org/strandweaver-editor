import { compileScript } from "@App/language/Compiler"

fit('comments are skipped', () => {
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