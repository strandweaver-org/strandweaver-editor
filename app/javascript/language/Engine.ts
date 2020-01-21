import * as elements from "./Elements"

export default class Engine {
  public startLocation: elements.BaseElement | null;
  public elementList: elements.BaseElement[] = [];
  public locationMap: { [key: string]: number } = {};

  constructor() {

  }

  addElement(element: elements.BaseElement) {
    this.elementList.push(element);
    const newIndex = this.elementList.length - 1;
    if (element.type == "Knot") {
      this.locationMap[(element as elements.Knot).name] = newIndex;

    }
  }

}
