import BaseClient from "./BaseClient";
import Engine from "../Engine";

export default class TestClient extends BaseClient {
  constructor(engine: Engine) {
    super(engine);
  }

  public isStoryOver(): boolean {
    return false;
  }

  public currentDisplayedBlocks(): string {
    return "";
  }

  public sendEngineMessage(category: string): void {
    console.log("engine", category);
  }
}
