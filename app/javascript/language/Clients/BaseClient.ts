import Engine from "../Engine"

export default abstract class BaseClient {
  private engine: Engine

  constructor(engine: Engine) {
    this.engine = engine;
  }

  abstract isStoryOver(): boolean;
}