import { compileScript } from "@App/language/Compiler"

fit('comments are skipped', () => {
  const res = compileScript(`\
// beep
// boop
=== start === // in-line comment
Here's the beginning // another in-line comment
// xxx
// fff
Almost to the end
`)

  expect(res).toHaveElementValue(0, "type", "Knot")
  expect(res).toHaveElementValue(0, "name", "start")
  expect(res).toHaveElementValue(1, "type", "Paragraph")
  expect(res).toHaveElementValue(1, "text", "Here's the beginning")
  expect(res).toHaveElementValue(2, "type", "Paragraph")
  expect(res).toHaveElementValue(2, "text", "Almost to the end")
})