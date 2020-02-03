import Engine from "../Engine";

export default abstract class BaseClient {
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  getEngine(): Engine {
    return this.engine;
  }

  abstract isStoryOver(): boolean;
  abstract sendEngineMessage(category: string): void;
}
