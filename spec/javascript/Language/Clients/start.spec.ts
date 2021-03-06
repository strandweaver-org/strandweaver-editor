import TestClient from "@App/Language/Clients/TestClient";
import { compileScript } from "@App/Language/Builder/Compiler";

describe("start of scripts", () => {
  it("are what is displayed at the beginning", () => {
    const compileResult = compileScript(`\
Hello
How are you doing?
-> END
`);

    expect(compileResult).toCompileSuccessfully();

    const client = new TestClient(compileResult.engine);

    expect(client).toDisplayTextMatching(/Hello\nHow are you doing?/);
    expect(client).toBeAtEndOfScript();
  });
});
