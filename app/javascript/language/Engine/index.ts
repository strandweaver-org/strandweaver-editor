import BaseObject from "../Objects/BaseObject";
import BaseClient from "../Clients/BaseClient";
import { BuildMessageHandler } from "@App/Language/Builder/Messages";

export interface EngineState {
  currentContainer: BaseObject | null;
  storyEnded: boolean;
  variables: { [key: string]: string | number };
}

export default class Engine {
  public strandVersion: string;
  public root: BaseObject;
  public locationMap: { [key: string]: BaseObject } = {};

  public state: EngineState;

  constructor() {
    this.state = {
      currentContainer: null,
      storyEnded: false,
      variables: {}
    };
  }

  restartStory(_client: BaseClient): void {
    if (this.root === undefined) {
      throw new Error(
        "Runtime Error: no Root container found. This should not normally happen. Game start failed."
      );
    }
  }

  registerObjectLocation(object: BaseObject): void {
    if (object.location == null) {
      throw new Error("Location is null for object");
    }

    this.locationMap[object.location] = object;
  }

  validate(messageHandler: BuildMessageHandler): void {
    this.root.validate(messageHandler);
  }
}
