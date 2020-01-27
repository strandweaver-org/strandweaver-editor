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

  it('jumps to the END are always correct', () => {
    const res = compileScript(`\
-> brook
=== beep ===
This is a sound.
-> END
=== brook ===
This is a body of water.
-> END
`)

    expect(res).toHaveNoCompilationMessages();
  })



})