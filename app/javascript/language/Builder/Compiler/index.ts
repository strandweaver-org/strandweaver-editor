import * as tokens from "@App/Language/Builder/Tokens";
import strandParser from "../Parser";
import BaseObject from "../../Objects/BaseObject";
import { BuildResponse } from "../Response";
import { BuildMessageType } from "../Messages";

export const validKnotNameRegex = /^[A-Za-z][A-Za-z_0-9]*$/;

export function compileTokens(parsedTokens: tokens.BaseToken[]): BuildResponse {
  const response = new BuildResponse();

  const engine = response.engine;
  engine.strandVersion = "1";

  const indentStack: [number, BaseObject][] = [];

  engine.root = new BaseObject("Container", engine);
  const startContainer = engine.root.createSubObject("Container");
  startContainer.location = "#start";
  indentStack.push([0, engine.root]);

  engine.registerObjectLocation(startContainer);
  let currentContainer = startContainer;

  function checkKnotHasValidName(knotToken: tokens.Knot): void {
    const name = knotToken.name;

    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
      response.addMessage(BuildMessageType.InvalidKnotName, knotToken.name);
    }

    if (name.toLowerCase() == "done" || name.toLowerCase() == "end") {
      response.addMessage(BuildMessageType.KnotNameReserved, knotToken.name);
    }

    if (name in engine.locationMap) {
      response.addMessage(
        BuildMessageType.KnotNameAlreadyDefined,
        knotToken.name
      );
    }
  }

  function registerNewKnot(knotToken: tokens.Knot): void {
    checkKnotHasValidName(knotToken);

    const newContainer = engine.root.createSubObject("Container");
    newContainer.location = knotToken.name;
    engine.registerObjectLocation(newContainer);
    currentContainer = newContainer;
  }

  function registerNewJump(jumpToken: tokens.Jump): void {
    const jumpObject = currentContainer.createSubObject("Jump");
    jumpObject.props["destination"] = jumpToken.location;
  }

  let tokenIndex = 0;
  const tokenLength: number = parsedTokens.length;
  while (tokenIndex < tokenLength && response.success === true) {
    const currentToken = parsedTokens[tokenIndex];

    switch (currentToken.type) {
      case "Knot":
        const knotToken = currentToken as tokens.Knot;
        registerNewKnot(knotToken);

        break;

      case "Jump":
        const jumpToken = currentToken as tokens.Jump;
        registerNewJump(jumpToken);
        break;
    }

    tokenIndex += 1;
  }

  if (response.success == true) {
    const endStory = engine.root.createSubObject("EndStory");
    endStory.location = "#end";
    engine.locationMap["DONE"] = endStory;
    engine.locationMap["END"] = endStory;
    response.validate();
  }

  return response;
}

export function compileScript(script: string): BuildResponse {
  const res = strandParser(script);
  if (res.success === false) {
    return res;
  }

  return compileTokens(res.tokens);
}
