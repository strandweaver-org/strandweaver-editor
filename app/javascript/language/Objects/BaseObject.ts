import Engine from "../Engine"

export default class BaseObject {
  public subObjects: BaseObject[] = [];
  public location: string
  public props: { [key: string]: string } = {};
  public type: string
  public engine: Engine
  public parent: BaseObject

  constructor(type: string, engine: Engine) {
    this.type = type;
  }
}
