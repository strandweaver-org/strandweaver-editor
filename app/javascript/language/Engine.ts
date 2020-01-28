import * as elements from "./Elements"
import BaseObject from "./Objects/BaseObject"

export default class Engine {
  public strandVersion: string;
  public root: BaseObject[]
  public locationMap: { [key: string]: BaseObject } = {}

  public currentLocation: number;

  constructor() {

  }

  registerElementLocation(object: BaseObject) {
    if (object.location == null) {
      throw new Error("Location is null for object");
    }

    this.locationMap[object.location] = object
  }
}
