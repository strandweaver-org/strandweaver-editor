import Engine, { IMessageHandler } from "../Engine"

export default class BaseObject {
  public subObjects: BaseObject[] = [];
  public location: string
  public props: { [key: string]: string } = {};
  public type: string
  public engine: Engine
  public parent: BaseObject

  constructor(type: string, engine: Engine) {
    this.type = type;
    this.engine = engine;
  }

  createSubObject(type: string): BaseObject {
    const subObject = new BaseObject(type, this.engine);
    subObject.parent = this;
    this.subObjects.push(subObject);

    return subObject;
  }

  validate(messageHandler: IMessageHandler) {
    this.subObjects.forEach((object) => {
      object.validate(messageHandler);
    })

    if (this.type === "Jump") {
      const jumpDestination: string = this.props.destination;
      if (!(jumpDestination in this.engine.locationMap)) {
        messageHandler("JUMP_LOCATION_NOT_FOUND", jumpDestination);
      }
    }
  }
}
