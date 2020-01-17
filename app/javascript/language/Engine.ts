import * as elements from "./Elements"

export default class Engine {
  public startElement: elements.BaseElement;
  public elementList: elements.BaseElement[] = [];
  public locationMap: { [key: string]: number } = {};

  constructor() {

  }

  addElement(element: elements.BaseElement) {
    this.elementList.push(element);
  }

}
