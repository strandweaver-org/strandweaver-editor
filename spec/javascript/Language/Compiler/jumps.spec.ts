import * as tokens from "@App/language/Tokens"
import { compileScript } from "@App/language/Compiler"

describe('jumps', () => {
  it('to a non-existent place causes an error', () => {
    const res = compileScript(`\
Hello
-> brook

=== beep ===
Test
`)

    expect(res).toContainCompilationMessageOfType("JUMP_LOCATION_NOT_FOUND")
  })

  it('if all jumps are correct, no errors are thrown', () => {
    const res = compileScript(`\
-> brook

=== beep ===
This is a sound.
-> brook

=== brook ===
This is a body of water.
-> beep

`)

    expect(res).toHaveNoCompilationMessages();
  })



})