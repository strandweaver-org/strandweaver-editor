import * as Messages from "./Messages";
import { BaseToken } from "./Tokens";
import Engine from "../Engine";

export class BuildResponse {
  public success: boolean;
  public messages: Messages.BuildMessage[];
  public tokens: BaseToken[];
  public engine: Engine;

  constructor() {
    this.success = true;
    this.messages = [];
    this.tokens = [];
    this.engine = new Engine();
    this.addMessage = this.addMessage.bind(this);
  }

  public addMessage(
    type: Messages.BuildMessageType,
    value?: string,
    location?: Messages.BuildScriptLocation
  ): void {
    const message: Messages.BuildMessage = Messages.createBuildMessage(
      type,
      value
    );

    if (location !== undefined) {
      message.location = location;
    }

    this.messages.push(message);

    if (message.category === Messages.BuildMessageCategory.Error) {
      this.success = false;
    }
  }

  public validate(): void {
    this.engine.validate(this.addMessage);
  }
}
