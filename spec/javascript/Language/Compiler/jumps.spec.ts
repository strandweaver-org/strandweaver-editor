import { compileScript } from "@App/Language/Builder/Compiler";

describe("jumps", () => {
  it("to a non-existent place causes an error", () => {
    const res = compileScript(`\
Hello
-> brook

=== beep ===
Test
`);

    expect(res).toContainCompilationMessageOfType("JumpLocationNotFound");
  });

  it("if all jumps are correct, no errors are thrown", () => {
    const res = compileScript(`\
-> brook

=== beep ===
This is a sound.
-> brook

=== brook ===
This is a body of water.
-> beep

`);

    expect(res).toHaveNoCompilationMessages();
  });

  it("jumps to the END are always correct", () => {
    const res = compileScript(`\
-> brook
=== beep ===
This is a sound.
-> END
=== brook ===
This is a body of water.
-> END
`);

    expect(res).toHaveNoCompilationMessages();
  });
});
