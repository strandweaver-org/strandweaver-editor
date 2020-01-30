import BaseObject from "./Objects/BaseObject"

export interface IMessageHandler {
  (messageType: string, value?: string): void
}

export interface IMessageSignature {
  code: string
  input: string
}

export default class Engine {
  public strandVersion: string;
  public root: BaseObject;
  public locationMap: { [key: string]: BaseObject } = {}

  public currentLocation: number;

  constructor() {

  }

  registerObjectLocation(object: BaseObject) {
    if (object.location == null) {
      throw new Error("Location is null for object");
    }

    this.locationMap[object.location] = object
  }

  validate(messageHandler: IMessageHandler) {
    this.root.validate(messageHandler);


  }
}
