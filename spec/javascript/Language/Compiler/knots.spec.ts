import * as tokens from "@App/Language/Builder/Tokens";
import { compileTokens } from "@App/Language/Builder/Compiler";
import { BuildMessageType } from "@App/Language/Builder/Messages";

describe("knots", () => {
  it("a knot with a malformed name gets rejected", () => {
    const res = compileTokens([new tokens.Knot("start!")]);

    expect(res).toContainCompilationMessageOfType(
      BuildMessageType.InvalidKnotName
    );
  });

  it("a knot with done as its name gets rejected", () => {
    const res = compileTokens([new tokens.Knot("done")]);

    expect(res).toContainCompilationMessageOfType(
      BuildMessageType.KnotNameReserved
    );
  });
});
