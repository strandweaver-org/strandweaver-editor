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

  expect(res).toCompileSuccessfully();
})